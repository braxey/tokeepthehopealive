<?php

declare(strict_types=1);

namespace App\Services;

use App\Constants\Pagination;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Support\Collection;

final class CommentService
{
    public function __construct(private MediaService $mediaService)
    {
    }

    /**
     * Get a page of comments for a post with the current page and whether there are more pages.
     */
    public function getCommentsForPost(Post $post, int $page = 1): array
    {
        $commentPaginator = $post->comments()
            ->with(['votes', 'user'])
            ->orderByDesc('vote_count')
            ->orderByDesc('created_at')
            ->paginate(page: $page, perPage: Pagination::COMMENTS_PER_PAGE);

        /** @var Collection<Comment> $replies */
        $replies = $commentPaginator->getCollection();

        $replies = $replies->map(function (Comment $comment) {
            // Get the time since the comment was posted.
            $comment->offsetSet('time_since', $comment->created_at->diffForHumans(short: true));

            // Get the user's vote on the comment.
            $comment->offsetSet('user_vote', $comment->userVote()?->vote);

            // Set the avatar URL if a user has an avatar set.
            if ($comment->user && $comment->user->avatar) {
                $comment->user->offsetSet('avatar_url', $this->mediaService->getUrl($comment->user->avatar));
            }

            // Unset the votes so we don't send them to the frontend.
            unset($comment->votes);

            return $comment;
        });

        return [
            'post' => [
                'replies' => $replies,
                'current_page' => $commentPaginator->currentPage(),
                'has_more' => $commentPaginator->hasMorePages(),
            ],
        ];
    }

    /**
     * Get a page of comments for a comment with the current page and whether there are more pages.
     */
    public function getRepliesForComment(Comment $comment, int $page = 1): array
    {
        $replyPaginator = $comment->comments()
            ->with(['votes', 'user', 'to_user'])
            ->orderBy('created_at')
            ->paginate(page: $page, perPage: Pagination::COMMENTS_PER_PAGE);

        /** @var Collection<Comment> $replies */
        $replies = $replyPaginator->getCollection();

        $replies = $replies->map(function (Comment $reply) {
            // Get the time since the comment was posted.
            $reply->offsetSet('time_since', $reply->created_at->diffForHumans(short: true));

            // Get the user's vote on the comment.
            $reply->offsetSet('user_vote', $reply->userVote()?->vote);

            // Set the avatar URL if a user has an avatar set.
            if ($reply->user && $reply->user->avatar) {
                $reply->user->offsetSet('avatar_url', $this->mediaService->getUrl($reply->user->avatar));
            }

            // Unset the votes so we don't send them to the frontend.
            unset($reply->votes);

            return $reply;
        });

        $commentKey = 'comment-'.$comment->id;

        return [
            $commentKey => [
                'replies' => $replies,
                'current_page' => $replyPaginator->currentPage(),
                'has_more' => $replyPaginator->hasMorePages(),
            ],
        ];
    }
}
