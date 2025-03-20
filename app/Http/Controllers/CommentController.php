<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller {
    public function store(Request $request, Post $post) {
        if (!Auth::user()) { // || !Auth::user()->hasVerifiedEmail()) {
            return back()->with('error', 'Please verify your email to comment.');
        }

        $request->validate([
            'body' => 'required|string',
        ]);

        Comment::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            'body' => $request->body,
        ]);

        return back()->with('success', 'Comment added!');
    }

    public function index(Post $post) {
        $comments = Comment::where('post_id', $post->id)
            ->with('user', 'votes')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($comment) {
                $comment->vote_count = $comment->voteCount();
                return $comment;
            });

        return response()->json($comments);
    }
}
