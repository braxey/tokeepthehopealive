<?php

declare(strict_types=1);

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
use Mews\Purifier\Facades\Purifier;

final class PostController extends Controller
{
    /**
     * Show all posts.
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
     * Get a page of posts.
     */
    public function getPostsPage(Request $request, PostService $postService): JsonResponse
    {
        $request->validate([
            'search' => 'nullable|string',
            'page' => 'required|integer|min:1',
        ]);

        $searchTerm = (string) $request->input('search');
        $pageNumber = (int) $request->input('page');

        $featuredPost = $postService->getFeaturedPost($searchTerm);
        $otherPosts = $postService->getPostsPage($featuredPost, $searchTerm, $pageNumber);

        return response()->json($otherPosts);
    }

    /**
     * Show a single post.
     */
    public function show(Post $post, CommentService $commentService): InertiaResponse
    {
        $post->load('votes', 'media');
        $post->offsetSet('user_vote', $post->userVote()?->vote);
        $post->offsetSet('preview_image', $post->preview_image ? Storage::url($post->preview_image) : null);

        $comments = $commentService->getCommentsForPost($post, 1);

        return Inertia::render('posts/show', [
            'post' => $post,
            'comments' => $comments,
        ]);
    }

    /**
     * Show page to create a post.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('posts/create');
    }

    /**
     * Store a post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        // Store preview image
        $previewImagePath = null;
        [$userId, $now, $uuid] = [Auth::id(), now()->getTimestamp(), uuidv4()];
        if ($request->hasFile('preview_image')) {
            $extension = $request->file('preview_image')->getClientOriginalExtension();
            $previewImagePath = "posts/post_preview-$userId-$now-$uuid.$extension";
            $file = $request->file('preview_image');
            app()->isLocal() ? $file->storePubliclyAs($previewImagePath) : $file->storeAs($previewImagePath, [
                'CacheControl' => 'max-age=31536000, public',
            ]);
        }

        // Store post
        $post = Post::create([
            'title' => $request->validated('title'),
            'body' => $body = Purifier::clean($request->validated('body')),
            'searchable_body' => strip_tags($body),
            'summary' => $request->validated('summary'),
            'user_id' => $userId,
            'preview_image' => $previewImagePath,
            'preview_caption' => $request->validated('preview_caption'),
        ]);

        // Link any uploaded media.
        $uploadedMediaIds = session('uploaded_media_ids', []);
        Media::query()->whereIn('id', $uploadedMediaIds)->update(['mediable_id' => $post->id]);
        session()->forget('uploaded_media_ids');

        return to_route('posts.index')->with('success', 'Post created!');
    }

    /**
     * Show page to edit a post.
     */
    public function edit(Post $post): InertiaResponse
    {
        $post->load('media');
        $post->offsetSet('preview_image_url', Storage::url($post->preview_image));

        return Inertia::render('posts/edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update a post.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        // Store new preview image
        $previewImagePath = null;
        [$userId, $now] = [Auth::id(), now()->getTimestamp()];
        if ($request->hasFile('preview_image')) {
            [$uuid, $extension] = [uuidv4(), $request->file('preview_image')->getClientOriginalExtension()];
            $previewImagePath = "posts/post_preview-$userId-$now-$uuid.$extension";
            $file = $request->file('preview_image');
            app()->isLocal() ? $file->storePubliclyAs($previewImagePath) : $file->storeAs($previewImagePath, [
                'CacheControl' => 'max-age=31536000, public',
            ]);

            // Delete old preview image
            Storage::delete($post->preview_image);
        }

        // Update post
        $post->update([
            'title' => $request->validated('title'),
            'body' => $body = Purifier::clean($request->validated('body')),
            'searchable_body' => strip_tags($body),
            'summary' => $request->validated('summary'),
            'preview_image' => $previewImagePath ?: $post->preview_image,
            'preview_caption' => $request->validated('preview_caption'),
        ]);

        // Link any uploaded media.
        $uploadedMediaIds = session('uploaded_media_ids', []);
        Media::query()->whereIn('id', $uploadedMediaIds)->update(['mediable_id' => $post->id]);
        session()->forget('uploaded_media_ids');

        return to_route('posts.show', $post)->with('success', 'Post updated!');
    }

    /**
     * Delete a post and all associated media.
     */
    public function delete(Post $post): RedirectResponse
    {
        // Delete preview image
        Storage::delete($post->preview_image);

        // Delete media
        $post->media->each(function (Media $media) {
            Storage::delete($media->path);
            $media->delete();
        });

        // Delete post
        $post->delete();

        return to_route('posts.index');
    }
}
