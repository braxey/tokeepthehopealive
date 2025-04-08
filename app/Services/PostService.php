<?php

namespace App\Services;

use App\Constants\Pagination;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;

class PostService
{
    /**
     * Get the featured post with optional searching.
     */
    public function getFeaturedPost(string $searchTerm): ?Post
    {
        $query = Post::query();

        // Apply search term if one is given.
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('summary', 'like', '%'.$searchTerm.'%')
                    ->orWhereJsonContains('body', $searchTerm);
            });
        }

        // Get the featured post if one exists.
        $featured = $query->orderByDesc('created_at')->first();

        if (! $featured) {
            return null;
        }

        // Set the url to the preview image.
        $featured->offsetSet('preview_image', Storage::url($featured->preview_image));

        return $featured;
    }

    /**
     * Get a page of posts for a post with the current page and whether there are more pages.
     */
    public function getPostsPage(?Post $featured, string $searchTerm, int $page = 1): array
    {
        if (! $featured) {
            return [
                'posts' => [],
                'current_page' => 1,
                'has_more' => false,
            ];
        }

        $query = Post::query();

        // Apply search term if one is given.
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('summary', 'like', '%'.$searchTerm.'%')
                    ->orWhereJsonContains('body', $searchTerm);
            });
        }

        // Get the page of posts.
        $paginator = $query->select(['id', 'title', 'created_at', 'preview_image'])
            ->whereNot('id', $featured->id) // Skip the featured post.
            ->orderByDesc('created_at')
            ->paginate(page: $page, perPage: Pagination::POSTS_PER_PAGE);

        // Set the preview image url for all the posts in the page.
        $posts = $paginator->getCollection()->map(function (Post $post) {
            $post->offsetSet('preview_image', Storage::url($post->preview_image));

            return $post->only(['id', 'title', 'preview_image', 'created_at']);
        });

        return [
            'posts' => $posts,
            'current_page' => $paginator->currentPage(),
            'has_more' => $paginator->hasMorePages(),
        ];
    }
}
