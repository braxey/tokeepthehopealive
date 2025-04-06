<?php

namespace App\Services;

use App\Constants\Pagination;
use App\Models\Comment;
use App\Models\Post;

class CommentService
{
    /**
     * Get a page of comments for a post with the current page and whether there are more pages.
     * @param Post $post
     * @param int $page
     * @return array
     */
    public function getCommentsForPost(Post $post, int $page = 1): array
    {
        $commentPaginator = $post->comments()
            ->with(['votes', 'user'])
            ->orderByDesc('vote_count')
            ->orderByDesc('created_at')
            ->paginate(page: $page, perPage: Pagination::COMMENTS_PER_PAGE);

        $replies = $commentPaginator->getCollection()->map(function (Comment $comment) {
            // Get the time since the comment was posted.
            $comment->offsetSet('time_since', $comment->created_at->diffForHumans(short: true));

            // Get the user's vote on the comment.
            $comment->offsetSet('user_vote', $comment->userVote()?->vote);

            // Unset the votes so we don't send them to the frontend.
            unset($comment->votes);

            return $comment;
        });

        return [
            'post' => [
                'replies' => $replies,
                'current_page' => $commentPaginator->currentPage(),
                'has_more' => $commentPaginator->hasMorePages(),
            ]
        ];
    }

    /**
     * Get a page of comments for a comment with the current page and whether there are more pages.
     * @param Comment $comment
     * @param int $page
     * @return array
     */
    public function getRepliesForComment(Comment $comment, int $page = 1): array
    {
        $replyPaginator = $comment->comments()
            ->with(['votes', 'user'])
            ->orderBy('created_at')
            ->paginate(page: $page, perPage: Pagination::COMMENTS_PER_PAGE);

        $replies = $replyPaginator->getCollection()->map(function (Comment $reply) {
            // Get the time since the comment was posted.
            $reply->offsetSet('time_since', $reply->created_at->diffForHumans(short: true));

            // Get the user's vote on the comment.
            $reply->offsetSet('user_vote', $reply->userVote()?->vote);

            // Unset the votes so we don't send them to the frontend.
            unset($reply->votes);

            return $reply;
        });

        $commentKey = 'comment-' . $comment->id;
        return [
            $commentKey => [
                'replies' => $replies,
                'current_page' => $replyPaginator->currentPage(),
                'has_more' => $replyPaginator->hasMorePages(),
            ]
        ];
    }
}
