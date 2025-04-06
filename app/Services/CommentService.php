<?php

namespace App\Services;

use App\Constants\Pagination;
use App\Models\Comment;
use App\Models\Post;

class CommentService
{
  public function getCommentsForPost(Post $post, int $page = 1)
  {
      $commentPaginator = $post->comments()
          ->with(['votes', 'user'])
          ->orderByDesc('created_at')
          ->paginate(page: $page, perPage: Pagination::COMMENTS_PER_PAGE);

      $replies = $commentPaginator->getCollection()->map(function (Comment $comment) {
          $comment->offsetSet('time_since', $comment->created_at->diffForHumans(short: true));
          $comment->offsetSet('user_vote', $comment->userVote()?->vote);
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

    public function getRepliesForComment(Comment $comment, int $page = 1)
    {
        $replyPaginator = $comment->comments()
            ->with(['votes', 'user'])
            ->orderByDesc('created_at')
            ->paginate(page: $page, perPage: Pagination::COMMENTS_PER_PAGE);

        // Transform replies to include vote count and time since.
        $replies = $replyPaginator->getCollection()->map(function (Comment $reply) {
            $reply->offsetSet('time_since', $reply->created_at->diffForHumans(short: true));
            $reply->offsetSet('user_vote', $reply->userVote()?->vote);
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
