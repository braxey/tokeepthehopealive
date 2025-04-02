<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response as InertiaResponse;

class PostController extends Controller
{
    /** ******************
     |     Display      |
     * *************** **/

    /**
     * Display all posts with optional search filtering.
     * @param  Request $request
     * @return InertiaResponse
     */
    public function index(Request $request): InertiaResponse
    {
        $search = $request->input('search');
        $query = Post::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('summary', 'like', '%' . $search . '%')
                    ->orWhereJsonContains('body', $search);
            });
        }

        $featured = $query->orderByDesc('created_at')->first();

        $pageNumber = $request->input('page', 1);
        $pagination = $query->select(['id', 'title', 'created_at', 'preview_image'])
            ->when($featured, fn ($q) => $q->where('id', '!=', $featured->id))
            ->orderByDesc('created_at')
            ->paginate(page: $pageNumber, perPage: 9);

        $posts = $pagination->getCollection()->map(function ($post) {
            $post->preview_image = $post->preview_image 
                ? asset('storage/' . $post->preview_image) 
                : ($post->media->firstWhere('type', 'image')?->url ?? null);
            return $post->only(['id', 'title', 'preview_image', 'created_at']);
        });

        function processFeaturedPost(?Post $featured): ?Post {
            if (!$featured) {
                return null;
            }

            $featured->preview_image = $featured->preview_image 
                ? asset('storage/' . $featured->preview_image) 
                : ($featured->media->firstWhere('type', 'image')?->url ?? null);
            $featured->media = $featured->media->map(function ($media) {
                $media->url = asset('storage/' . $media->path);
                return $media;
            });

            return $featured;
        }

        return Inertia::render('posts/index', [
            'featured' => fn () => processFeaturedPost($featured),
            'nextPageUrl' => $pagination->nextPageUrl(),
            'posts' => Inertia::merge($posts),
            'search' => $search,
        ]);
    }

    /**
     * Display one post, and maybe its comments.
     * @param  Post $post
     * @return InertiaResponse
     */
    public function show(Request $request, Post $post): InertiaResponse
    {
        // Prepare post.
        $post->load('votes', 'media');
        $post->vote_count = $post->votes->sum('vote');
        $post->user_vote = $request->user() ? $post->votes->where('user_id', $request->user()->id)->value('vote') : null;
        $post->media = $post->media->sortBy('position')->map(function ($media) {
            $media->url = asset('storage/' . $media->path);
            return $media;
        });
        $post->preview_image = $post->preview_image ? asset('storage/' . $post->preview_image) : null;

        $firstTenComments = $post->comments()
            ->with(['votes', 'user'])
            ->orderByDesc('created_at')
            ->paginate(page: 1, perPage: 10)
            ->getCollection();

        // Prepare comments.
        $commentPageNumber = $request->input('commentPage', 1);
        $commentPaginator = $post->comments()
            ->with(['votes', 'user'])
            ->orderByDesc('created_at')
            ->paginate(page: $commentPageNumber, perPage: 10, pageName: 'commentPage');

        // Transform comments to include vote count and time since.
        $comments = $firstTenComments->concat($commentPaginator->getCollection())
            ->map(function ($comment) use ($request) {
                $comment->vote_count = $comment->votes->sum('vote');
                $comment->time_since = $comment->created_at ? $comment->created_at->diffForHumans(short: true) : 'Unknown time';
                $comment->user_vote = $request->user() ? $comment->votes->where('user_id', $request->user()->id)->value('vote') : null;
                unset($comment->votes);
                return $comment;
            });

        return Inertia::render('posts/show', [
            'post' => $post,
            'nextCommentPageUrl' => $commentPaginator->nextPageUrl(),
            'comments' => Inertia::merge($comments),
        ]);
    }

    /** ******************
     |     Creation     |
     * *************** **/

    /**
     * Display page to create a new post.
     * @return InertiaResponse
     */
    public function showCreatePage()
    {
        return Inertia::render('posts/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|array|min:1',
            'body.*.section_title' => 'nullable|string|max:255',
            'body.*.section_text' => 'nullable|string',
            'summary' => 'required|string',
            'preview_image' => 'nullable|file|mimes:jpg,png,gif|max:10240',
            'preview_caption' => 'nullable|string|max:255',
            'media.*' => 'nullable|file|mimes:jpg,png,gif,mp4,webm|max:10240',
            'media_positions' => 'nullable|array',
            'media_positions.*' => 'integer',
            'media_captions' => 'nullable|array',
            'media_captions.*' => 'string|nullable|max:255',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'body' => $request->body,
            'summary' => $request->summary,
            'user_id' => Auth::id(),
            'preview_image' => $request->hasFile('preview_image') ? $request->file('preview_image')->store('posts', 'public') : null,
            'preview_caption' => $request->input('preview_caption'),
        ]);

        if ($request->hasFile('media')) {
            $positions = $request->input('media_positions', []);
            $captions = $request->input('media_captions', []);
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts', 'public');
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index,
                    'caption' => $captions[$index] ?? null,
                ]);
            }
        }

        return redirect()->route('posts.index')->with('success', 'Post created!');
    }

    /** ******************
     |       Edit       |
     * *************** **/

    public function edit(Post $post)
    {
        $post->load('media');
        $post->media = $post->media->map(function ($media) {
            $media->url = asset('storage/' . $media->path);
            return $media;
        });
        $post->preview_image = $post->preview_image ? asset('storage/' . $post->preview_image) : null;

        return Inertia::render('posts/edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|array|min:1',
            'body.*.section_title' => 'nullable|string|max:255',
            'body.*.section_text' => 'nullable|string',
            'summary' => 'required|string',
            'preview_image' => 'nullable|file|mimes:jpg,png,gif|max:10240',
            'preview_caption' => 'nullable|string|max:255',
            'media.*' => 'nullable|file|mimes:jpg,png,gif,mp4,webm|max:10240',
            'media_positions' => 'nullable|array',
            'media_positions.*' => 'integer',
            'media_captions' => 'nullable|array',
            'media_captions.*' => 'string|nullable|max:255',
            'existing_media' => 'nullable|array',
            'existing_media.*.id' => 'integer|exists:media,id',
            'existing_media.*.position' => 'integer',
            'existing_media.*.caption' => 'string|nullable|max:255',
            'deleted_media' => 'nullable|array',
            'deleted_media.*' => 'integer|exists:media,id',
        ]);

        // Update post attributes
        $post->update([
            'title' => $request->title,
            'body' => $request->body,
            'summary' => $request->summary,
            'preview_image' => $request->hasFile('preview_image')
                ? $request->file('preview_image')->store('posts', 'public')
                : $post->preview_image,
            'preview_caption' => $request->input('preview_caption'),
        ]);

        // Handle deletion of existing media
        $deletedMediaIds = $request->input('deleted_media', []);
        if (!empty($deletedMediaIds)) {
            $post->media()->whereIn('id', $deletedMediaIds)->delete();
        }

        // Handle existing media updates (position, caption)
        $existingMedia = $request->input('existing_media', []);
        foreach ($existingMedia as $mediaData) {
            $media = $post->media()->find($mediaData['id']);
            if ($media) {
                $media->update([
                    'position' => $mediaData['position'] ?? $media->position,
                    'caption' => $mediaData['caption'] ?? $media->caption,
                ]);
            }
        }

        if ($request->hasFile('media')) {
            $positions = $request->input('media_positions', []);
            $captions = $request->input('media_captions', []);
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts', 'public');
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index,
                    'caption' => $captions[$index] ?? null,
                ]);
            }
        }

        return redirect()->route('posts.show', $post)->with('success', 'Post updated!');
    }
}
