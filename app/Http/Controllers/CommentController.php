<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Services\CommentService;
use Exception;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(
        protected CommentService $commentService,
    ) {}

    public function onPost(Request $request, Post $post)
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

    public function onComment(Request $request, Comment $comment)
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

    public function getComments(Request $request, Post $post)
    {
        return response()->json($this->commentService->getCommentsForPost($post, $request->input('page', 1)));
    }

    public function getReplies(Request $request, Comment $comment)
    {
        return response()->json($this->commentService->getRepliesForComment($comment, $request->input('page', 1)));
    }
}
