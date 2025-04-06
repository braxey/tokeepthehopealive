<?php

namespace App\Http\Controllers;

use App\Constants\Pagination;
use App\Models\Media;
use App\Models\Post;
use App\Services\CommentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Response as InertiaResponse;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Uid\UuidV4;

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
        if ($featured && $featured->preview_image) {
            $featured->preview_image = Storage::url($featured->preview_image);
        }

        $pageNumber = $request->input('page', 1);
        $pagination = $query->select(['id', 'title', 'created_at', 'preview_image'])
            ->when($featured, fn ($q) => $q->where('id', '!=', $featured->id))
            ->orderByDesc('created_at')
            ->paginate(page: $pageNumber, perPage: Pagination::POSTS_PER_PAGE);

        $posts = $pagination->getCollection()->map(function (Post $post) {
            $post->preview_image = $post->preview_image 
                ? Storage::url($post->preview_image)
                : null;

            return $post->only(['id', 'title', 'preview_image', 'created_at']);
        });

        return Inertia::render('posts/index', [
            'featured' => $featured,
            'nextPageUrl' => $pagination->nextPageUrl(),
            'posts' => Inertia::merge($posts),
            'search' => $search,
        ]);
    }

    /**
     * Display one post.
     * @param  Post $post
     * @return InertiaResponse
     */
    public function show(Post $post, CommentService $commentService): InertiaResponse
    {
        $post->load('votes', 'media');
        $post->offsetSet('user_vote', $post->userVote()?->vote);
        $post->offsetSet('preview_image', $post->preview_image ? Storage::url($post->preview_image) : null);
        $post->offsetSet('media', $post->media->sortBy('position')->map(function (Media $media) {
            $media->offsetSet('url', Storage::url($media->path));
            return $media;
        }));

        $comments = $commentService->getCommentsForPost($post, 1);

        return Inertia::render('posts/show', [
            'post' => $post,
            'comments' => $comments,
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

        $previewImagePath = null;
        if ($request->hasFile('preview_image')) {
            [$userId, $now, $uuid] = [Auth::id(), now()->getTimestamp(), Uuid::uuid4()->toString()];
            $extension = $request->file('preview_image')->getClientOriginalExtension();

            $previewImagePath = "post_preview-$userId-$now-$uuid.$extension";
            $request->file('preview_image')->storePubliclyAs($previewImagePath);
        }

        $post = Post::create([
            'title' => $request->title,
            'body' => $request->body,
            'summary' => $request->summary,
            'user_id' => Auth::id(),
            'preview_image' => $previewImagePath,
            'preview_caption' => $request->input('preview_caption'),
        ]);

        if ($request->hasFile('media')) {
            $positions = $request->input('media_positions', []);
            $captions = $request->input('media_captions', []);

            [$userId, $now] = [Auth::id(), now()->getTimestamp()];
            foreach ($request->file('media') as $index => $file) {
                [$uuid, $extension] = [Uuid::uuid4()->toString(), $file->getClientOriginalExtension()];

                $path = "post_media-$userId-$now-$uuid.$extension";
                $file->storePubliclyAs($path);

                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';

                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index,
                    'caption' => $captions[$index] ?? null,
                ]);
            }
        }

        return to_route('posts.index')->with('success', 'Post created!');
    }

    /** ******************
     |       Edit       |
     * *************** **/

    public function edit(Post $post)
    {
        $post->load('media');
        $post->preview_image = $post->preview_image ? Storage::url($post->preview_image) : null;
        $post->media = $post->media->map(function (Media $media) {
            $media->offsetSet('url', Storage::url($media->path));
            return $media;
        });

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
        $previewImagePath = null;
        if ($request->hasFile('preview_image')) {
            [$userId, $now, $uuid] = [Auth::id(), now()->getTimestamp(), Uuid::uuid4()->toString()];
            $extension = $request->file('preview_image')->getClientOriginalExtension();

            $previewImagePath = "post_preview-$userId-$now-$uuid.$extension";
            $request->file('preview_image')->storePubliclyAs($previewImagePath);
        }

        Storage::delete($post->preview_image);

        $post->update([
            'title' => $request->title,
            'body' => $request->body,
            'summary' => $request->summary,
            'preview_image' => $previewImagePath,
            'preview_caption' => $request->input('preview_caption'),
        ]);

        $deletedMediaIds = $request->input('deleted_media', []);
        if (!empty($deletedMediaIds)) {
            $mediaToDelete = $post->media()->whereIn('id', $deletedMediaIds)->get();
            $mediaToDelete->each(function (Media $media) {
                Storage::delete($media->path);
                $media->delete();
            });
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
            [$userId, $now] = [Auth::id(), now()->getTimestamp()];

            $positions = $request->input('media_positions', []);
            $captions = $request->input('media_captions', []);
            foreach ($request->file('media') as $index => $file) {
                [$uuid, $extension] = [Uuid::uuid4()->toString(), $file->getClientOriginalExtension()];

                $path = "post_media-$userId-$now-$uuid.$extension";
                $file->storePubliclyAs($path);

                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => $positions[$index] ?? $index,
                    'caption' => $captions[$index] ?? null,
                ]);
            }
        }

        return to_route('posts.show', $post)->with('success', 'Post updated!');
    }

    /** ******************
     |      Delete      |
     * *************** **/
    public function delete(Post $post): RedirectResponse
    {
        if ($post->preview_image) {
            Storage::delete($post->preview_image);
        }

        $post->media->each(function (Media $media) {
            Storage::delete($media->path);
            $media->delete();
        });

        $post->delete();

        return to_route('posts.index');
    }
}
