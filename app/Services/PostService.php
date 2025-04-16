<?php

declare(strict_types=1);

namespace App\Services;

use App\Constants\Pagination;
use App\Models\Post;

final class PostService
{
    public function __construct(private MediaService $mediaService)
    {
    }

    /**
     * Get the featured post with optional searching.
     */
    public function getFeaturedPost(string $searchTerm, string $order): ?Post
    {
        $query = Post::query()->whereNull('archived_at');

        // Apply search term if one is given.
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('summary', 'like', '%'.$searchTerm.'%')
                    ->orWhere('searchable_body', 'like', '%'.$searchTerm.'%');
            });
        }

        // Apply ordering.
        match($order) {
            'popular' => $query->orderByDesc('vote_count')->orderByDesc('created_at'),
            'oldest' => $query->orderBy('created_at'),
            'recent' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('created_at')
        };

        // Get the featured post if one exists.
        $featured = $query->first();

        if (! $featured) {
            return null;
        }

        // Set the url to the preview image.
        $featured->offsetSet('preview_image_url', $this->mediaService->getUrl($featured->preview_image));

        return $featured;
    }

    /**
     * Get a page of posts for a post with the current page and whether there are more pages.
     */
    public function getPostsPage(?Post $featured, string $searchTerm, string $order, int $page = 1): array
    {
        if (! $featured) {
            return [
                'posts' => [],
                'current_page' => 1,
                'has_more' => false,
            ];
        }

        $query = Post::query()
            ->whereNull('archived_at')
            ->whereNot('id', $featured->id); // Skip the featured post.

        // Apply search term if one is given.
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('summary', 'like', '%'.$searchTerm.'%')
                    ->orWhere('searchable_body', 'like', '%'.$searchTerm.'%');
            });
        }

        // Apply ordering.
        match($order) {
            'popular' => $query->orderByDesc('vote_count')->orderByDesc('created_at'),
            'oldest' => $query->orderBy('created_at'),
            'recent' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('created_at')
        };

        // Get the page of posts.
        $paginator = $query->select(['id', 'title', 'created_at', 'preview_image'])
                        ->paginate(page: $page, perPage: Pagination::POSTS_PER_PAGE);

        // Set the preview image url for all the posts in the page.
        $posts = $paginator->getCollection()->map(function (Post $post) {
            $post->offsetSet('preview_image_url', $this->mediaService->getUrl($post->preview_image));

            return $post->only(['id', 'title', 'preview_image_url', 'created_at']);
        });

        return [
            'posts' => $posts,
            'current_page' => $paginator->currentPage(),
            'has_more' => $paginator->hasMorePages(),
        ];
    }
}
