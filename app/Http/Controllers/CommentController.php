<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(
        protected CommentService $commentService,
    ) {}

    /**
     * Submit a comment on a post.
     * @param Request $request
     * @param Post $post
     * @return RedirectResponse
     */
    public function onPost(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'to_user_id' => 'required|int|exists:users,id',
            'body' => 'required|string|min:1|max:1000',
        ]);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'to_user_id' => $request->input('to_user_id'),
            'body' => $request->input('body'),
        ]);

        $post->increment('reply_count');

        return back();
    }

    /**
     * Submit a comment on another comment.
     * @param Request $request
     * @param Comment $comment
     * @return RedirectResponse
     */
    public function onComment(Request $request, Comment $comment): RedirectResponse
    {
        $request->validate([
            'to_user_id' => 'required|int|exists:users,id',
            'body' => 'required|string|min:1|max:1000',
        ]);

        $comment->comments()->create([
            'user_id' => $request->user()->id,
            'to_user_id' => $request->input('to_user_id'),
            'body' => $request->input('body'),
        ]);

        $comment->increment('reply_count');

        return back();
    }

    /**
     * Get 10 comments for a post with the current page and whether there are more pages.
     * @param Request $request
     * @param Post $post
     * @return JsonResponse
     */
    public function getComments(Request $request, Post $post): JsonResponse
    {
        return response()->json($this->commentService->getCommentsForPost($post, $request->input('page', 1)));
    }

    /**
     * Get 10 comments for a top-level-comment with the current page and whether there are more pages.
     * @param Request $request
     * @param Comment $comment
     * @return JsonResponse
     */
    public function getReplies(Request $request, Comment $comment): JsonResponse
    {
        return response()->json($this->commentService->getRepliesForComment($comment, $request->input('page', 1)));
    }
}
