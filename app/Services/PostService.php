<?php

declare(strict_types=1);

namespace App\Services;

use App\Constants\Pagination;
use App\Constants\PostFilter;
use App\Constants\PostOrder;
use App\Dtos\GetPostsDto;
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

final class PostService
{
    public function __construct(private MediaService $mediaService)
    {
    }

    /**
     * Get the featured post with optional searching.
     */
    public function getFeaturedPost(GetPostsDto $dto): ?Post
    {
        // Get the featured post if one exists.
        $featured = $this->buildPostQuery($dto)->first();

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
    public function getPostsPage(?Post $featured, GetPostsDto $dto): array
    {
        if (! $featured) {
            return [
                'posts' => [],
                'current_page' => 1,
                'has_more' => false,
            ];
        }

        $query = $this->buildPostQuery($dto)
            ->whereNot('id', $featured->id); // Skip the featured post.

        // Get the page of posts.
        $paginator = $query->select(['id', 'title', 'created_at', 'preview_image'])
                        ->paginate(page: $dto->pageNumber, perPage: Pagination::POSTS_PER_PAGE);

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

    /**
     * @return Builder<Post>
     */
    private function buildPostQuery(GetPostsDto $dto): Builder
    {
        $query = Post::query();

        // Apply search term if one is given.
        if ($dto->searchTerm) {
            $query->whereAny([
                'title', 'summary', 'searchable_body'
            ], 'like', '%'.$dto->searchTerm.'%');
        }

        // Apply filtering (only allowed for users with permission to post).
        Auth::user()?->permission->canPost()
            ? match($dto->filter) {
                PostFilter::ALL => $query,
                PostFilter::PUBLISHED => $query->whereNull('archived_at'),
                PostFilter::ARCHIVED => $query->whereNotNull('archived_at'),
                default => $query->whereNull('archived_at')
            }
        : $query->whereNull('archived_at');

        // Apply ordering.
        match($dto->order) {
            PostOrder::POPULAR => $query->orderByDesc('vote_count')->orderByDesc('created_at'),
            PostOrder::OLDEST => $query->orderBy('created_at'),
            PostOrder::RECENT => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('created_at')
        };

        return $query;
    }
}
