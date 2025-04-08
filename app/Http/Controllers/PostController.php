<?php

namespace App\Http\Controllers;

use App\Http\Requests\Posts\StorePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Models\Media;
use App\Models\Post;
use App\Services\CommentService;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PostController extends Controller
{
    /** ******************
     |     Display      |
     * *************** **/

    /**
     * Display all posts with optional search filtering.
     */
    public function index(Request $request, PostService $postService): InertiaResponse
    {
        $request->validate([
            'search' => 'nullable|string',
        ]);

        $searchTerm = (string) $request->input('search');
        $featuredPost = $postService->getFeaturedPost($searchTerm);
        $otherPosts = $postService->getPostsPage($featuredPost, $searchTerm, 1);

        return Inertia::render('posts/index', [
            'search' => $searchTerm,
            'featured' => $featuredPost,
            'otherPosts' => $otherPosts,
        ]);
    }

    /**
     * Get a specific page of posts, used for loading more.
     */
    public function getPostsPage(Request $request, PostService $postService): JsonResponse
    {
        $request->validate([
            'search' => 'nullable|string',
            'page' => 'required|integer|min:1',
        ]);

        $searchTerm = (string) $request->input('search');
        $pageNumber = $request->input('page');

        $featuredPost = $postService->getFeaturedPost($searchTerm);
        $otherPosts = $postService->getPostsPage($featuredPost, $searchTerm, $pageNumber);

        return response()->json($otherPosts);
    }

    /**
     * Display one post.
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
     */
    public function showCreatePage(): InertiaResponse
    {
        return Inertia::render('posts/create');
    }

    /**
     * Store a post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        // Store preview image.
        [$userId, $now, $uuid] = [Auth::id(), now()->getTimestamp(), uuidv4()];
        $extension = $request->file('preview_image')->getClientOriginalExtension();

        $previewImagePath = "post_preview-$userId-$now-$uuid.$extension";
        $request->file('preview_image')->storePubliclyAs($previewImagePath);

        // Store post.
        $post = Post::create([
            'title' => $request->validated('title'),
            'body' => $request->validated('body'),
            'summary' => $request->validated('summary'),
            'user_id' => $userId,
            'preview_image' => $previewImagePath,
            'preview_caption' => $request->validated('preview_caption'),
        ]);

        // Store additional media.
        if ($request->hasFile('media')) {
            $positions = $request->validated('media_positions', []);
            $captions = $request->validated('media_captions', []);

            foreach ($request->file('media') as $index => $file) {
                [$uuid, $extension] = [uuidv4(), $file->getClientOriginalExtension()];
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';

                // Store file.
                $path = "post_media-$userId-$now-$uuid.$extension";
                $file->storePubliclyAs($path);

                // Store media record.
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => data_get($positions, $index, $index),
                    'caption' => data_get($captions, $index),
                ]);
            }
        }

        return to_route('posts.index')->with('success', 'Post created!');
    }

    /** ******************
     |       Edit       |
     * *************** **/

    /**
     * Display page to edit an existing post.
     */
    public function edit(Post $post): InertiaResponse
    {
        $post->load('media');
        $post->offsetSet('preview_image', $post->preview_image ? Storage::url($post->preview_image) : null);
        $post->offsetSet('media', $post->media->map(function (Media $media) {
            $media->offsetSet('url', Storage::url($media->path));

            return $media;
        }));

        return Inertia::render('posts/edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update post.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        // Store new preview image.
        $previewImagePath = null;
        [$userId, $now] = [Auth::id(), now()->getTimestamp()];
        if ($request->hasFile('preview_image')) {
            // Store the new file.
            [$uuid, $extension] = [uuidv4(), $request->file('preview_image')->getClientOriginalExtension()];
            $previewImagePath = "post_preview-$userId-$now-$uuid.$extension";
            $request->file('preview_image')->storePubliclyAs($previewImagePath);

            // Delete previous file.
            Storage::delete($post->preview_image);
        }

        // Update the post record.
        $post->update([
            'title' => $request->validated('title'),
            'body' => $request->validated('body'),
            'summary' => $request->validated('summary'),
            'preview_image' => $previewImagePath ?: $post->preview_image,
            'preview_caption' => $request->validated('preview_caption'),
        ]);

        // Delete removed additional media.
        $deletedMediaIds = $request->validated('deleted_media', []);
        if (! empty($deletedMediaIds)) {
            $mediaToDelete = $post->media()->whereIn('id', $deletedMediaIds)->get();
            $mediaToDelete->each(function (Media $media) {
                // Delete the file.
                Storage::delete($media->path);

                // Delete the record.
                $media->delete();
            });
        }

        // Update existing media positions and indexes.
        $existingMedia = $request->validated('existing_media', []);
        foreach ($existingMedia as $mediaData) {
            $media = $post->media()->find($mediaData['id']);
            if ($media) {
                $media->update([
                    'position' => data_get($mediaData, 'position', $media->position),
                    'caption' => data_get($mediaData, 'caption', $media->caption),
                ]);
            }
        }

        // Save new additional media.
        if ($request->hasFile('media')) {
            $positions = $request->validated('media_positions', []);
            $captions = $request->validated('media_captions', []);
            foreach ($request->file('media') as $index => $file) {
                [$uuid, $extension] = [uuidv4(), $file->getClientOriginalExtension()];
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';

                // Store media file.
                $path = "post_media-$userId-$now-$uuid.$extension";
                $file->storePubliclyAs($path);

                // Create new media record.
                $post->media()->create([
                    'path' => $path,
                    'type' => $type,
                    'position' => data_get($positions, $index, $index),
                    'caption' => data_get($captions, $index),
                ]);
            }
        }

        return to_route('posts.show', $post)->with('success', 'Post updated!');
    }

    /** ******************
     |      Delete      |
     * *************** **/

    /**
     * Delete a post.
     */
    public function delete(Post $post): RedirectResponse
    {
        // Delete the preview image.
        Storage::delete($post->preview_image);

        // Delete all additional media.
        $post->media->each(function (Media $media) {
            // Delete the file.
            Storage::delete($media->path);

            // Delete the media record.
            $media->delete();
        });

        // Delete the post record.
        $post->delete();

        return to_route('posts.index');
    }
}
