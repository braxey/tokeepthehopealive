<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    public function votePost(Request $request, Post $post)
    {
        $request->validate([
            'value' => 'required|in:1,-1',
        ]);

        $value = $request->input('value');
        $existingVote = $post->votes()->where('user_id', Auth::id())->first();

        if ($existingVote) {
            if ($existingVote->vote === $value) {
                $existingVote->delete();
            } else {
                $existingVote->update(['vote' => $value]);
            }
        } else {
            $post->votes()->create(['user_id' => Auth::id(), 'vote' => $value]);
        }

        return back();
    }

    public function voteComment(Request $request, Comment $comment)
    {
        $request->validate([
            'value' => 'required|in:1,-1',
        ]);

        $value = $request->input('value');
        $existingVote = $comment->votes()->where('user_id', Auth::id())->first();

        if ($existingVote) {
            if ($existingVote->vote === $value) {
                $existingVote->delete();
            } else {
                $existingVote->update(['vote' => $value]);
            }
        } else {
            $comment->votes()->create(['user_id' => Auth::id(), 'vote' => $value]);
        }

        return back();
    }
}
