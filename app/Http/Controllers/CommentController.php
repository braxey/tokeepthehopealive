<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class CommentController extends Controller
{
    public function __construct(
        protected CommentService $commentService,
    ) {
    }

    /**
     * Comment on a post.
     */
    public function onPost(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'to_user_id' => 'required|int|exists:users,id',
            'body' => 'required|string|min:1|max:1000',
        ]);

        // Insert comment.
        $post->comments()->create([
            'user_id' => $request->user()->id,
            'to_user_id' => $request->input('to_user_id'),
            'body' => $request->input('body'),
        ]);

        // Increment reply count on post.
        $post->increment('reply_count');

        return back();
    }

    /**
     * Comment on another comment.
     */
    public function onComment(Request $request, Comment $comment): RedirectResponse
    {
        $request->validate([
            'to_user_id' => 'required|int|exists:users,id',
            'body' => 'required|string|min:1|max:1000',
        ]);

        // Insert comment.
        $comment->comments()->create([
            'user_id' => $request->user()->id,
            'to_user_id' => $request->input('to_user_id'),
            'body' => $request->input('body'),
        ]);

        // Increment reply count on comment.
        $comment->increment('reply_count');

        return back();
    }

    /**
     * Get a page of comments for a post with the current page and whether there are more pages.
     */
    public function getComments(Request $request, Post $post): JsonResponse
    {
        return response()->json($this->commentService->getCommentsForPost($post, (int) $request->input('page', 1)));
    }

    /**
     * Get a page of comments for a top-level-comment with the current page and whether there are more pages.
     */
    public function getReplies(Request $request, Comment $comment): JsonResponse
    {
        return response()->json($this->commentService->getRepliesForComment($comment, (int) $request->input('page', 1)));
    }
}
