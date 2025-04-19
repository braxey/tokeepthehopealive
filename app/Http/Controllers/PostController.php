<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Constants\MediaDirectory;
use App\Constants\PostFilter;
use App\Constants\PostOrder;
use App\Dtos\GetPostsDto;
use App\Dtos\MediaDto;
use App\Http\Requests\Posts\StorePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Models\Post;
use App\Services\CommentService;
use App\Services\MediaService;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Mews\Purifier\Facades\Purifier;

final class PostController extends Controller
{
    public function __construct(
        private PostService $postService,
        private CommentService $commentService,
        private MediaService $mediaService,
    ) {
    }

    /**
     * Show all posts.
     */
    public function index(Request $request): InertiaResponse
    {
        $orders = PostOrder::allSerialized();
        $filters = PostFilter::allSerialized();

        $request->validate([
            'search' => 'nullable|string',
            'order' => "nullable|string|in:$orders",
            'filter' => "nullable|string|in:$filters",
        ]);

        $dto = new GetPostsDto($request);
        $featuredPost = $this->postService->getFeaturedPost($dto);
        $otherPosts = $this->postService->getPostsPage($featuredPost, $dto);

        return Inertia::render('posts/index', [
            'search' => $dto->searchTerm,
            'order' => $dto->order,
            'filter' => $dto->filter,
            'featured' => $featuredPost,
            'otherPosts' => $otherPosts,
        ]);
    }

    /**
     * Get a page of posts.
     */
    public function getPostsPage(Request $request): JsonResponse
    {
        $orders = PostOrder::allSerialized();
        $filters = PostFilter::allSerialized();

        $request->validate([
            'search' => 'nullable|string',
            'order' => "nullable|string|in:$orders",
            'filter' => "nullable|string|in:$filters",
            'page' => 'required|integer|min:1',
        ]);

        $dto = new GetPostsDto($request);
        $featuredPost = $this->postService->getFeaturedPost($dto);
        $otherPosts = $this->postService->getPostsPage($featuredPost, $dto);

        return response()->json($otherPosts);
    }

    /**
     * Show a single post.
     */
    public function show(Post $post): InertiaResponse
    {
        $post->load('votes', 'media');
        $post->offsetSet('user_vote', $post->userVote()?->vote);
        $post->offsetSet('preview_image_url', $this->mediaService->getUrl($post->preview_image));

        $comments = $this->commentService->getCommentsForPost($post, 1);

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
        $file = $request->file('preview_image');
        $mediaDto = new MediaDto(file: $file, storageDirectory: MediaDirectory::PREVIEWS);
        $this->mediaService->storeFile($mediaDto);

        // Store post
        $post = Post::create([
            'title' => $request->validated('title'),
            'body' => $body = Purifier::clean($request->validated('body')),
            'searchable_body' => strip_tags($body),
            'summary' => $request->validated('summary'),
            'user_id' => Auth::id(),
            'preview_image' => $mediaDto->getPath(),
            'preview_caption' => $request->validated('preview_caption'),
        ]);

        $this->mediaService->syncMediaForPost($post);

        return to_route('posts.index')->with('success', 'Post created!');
    }

    /**
     * Show page to edit a post.
     */
    public function edit(Post $post): InertiaResponse
    {
        $post->load('media');
        $post->offsetSet('preview_image_url', $this->mediaService->getUrl($post->preview_image));

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
        $path = null;
        if ($request->hasFile('preview_image')) {
            $file = $request->file('preview_image');
            $mediaDto = new MediaDto(file: $file, storageDirectory: MediaDirectory::PREVIEWS);
            $path = $mediaDto->getPath();
            $this->mediaService->storeFile($mediaDto);

            // Delete old preview image
            $this->mediaService->deleteFile($post->preview_image);
        }

        // Update post
        $post->update([
            'title' => $request->validated('title'),
            'body' => $body = Purifier::clean($request->validated('body')),
            'searchable_body' => strip_tags($body),
            'summary' => $request->validated('summary'),
            'preview_image' => $path ?: $post->preview_image,
            'preview_caption' => $request->validated('preview_caption'),
        ]);

        $this->mediaService->syncMediaForPost($post);

        return to_route('posts.show', $post)->with('success', 'Post updated!');
    }

    /**
     * Archive a post.
     */
    public function archive(Post $post): RedirectResponse
    {
        $post->update([
            'archived_at' => now(),
        ]);

        return to_route('posts.index');
    }

    /**
     * Delete a post and all associated media.
     */
    public function delete(Post $post): RedirectResponse
    {
        // Delete all media associated with the post.
        $this->mediaService->deleteForPost($post);

        // Delete post
        $post->delete();

        return to_route('posts.index');
    }
}
