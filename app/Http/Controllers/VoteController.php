<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    public function onPost(Request $request, Post $post)
    {
        $request->validate([
            'value' => 'required|in:1,-1',
        ]);

        $value = $request->input('value');
        $existingVote = $post->votes()->firstWhere('user_id', Auth::id());

        if ($existingVote) {
            if ($existingVote->vote === $value) {
                $existingVote->delete();

                $value === 1
                    ? $post->decrement('vote_count')
                    : $post->increment('vote_count');
            } else {
                $existingVote->update(['vote' => $value]);

                $value === 1
                    ? $post->increment('vote_count', 2)
                    : $post->decrement('vote_count', 2);
            }
        } else {
            $post->votes()->create(['user_id' => Auth::id(), 'vote' => $value]);

            $value === 1
                ? $post->increment('vote_count')
                : $post->decrement('vote_count');
        }

        return back();
    }

    public function onComment(Request $request, Comment $comment)
    {
        $request->validate([
            'value' => 'required|in:1,-1',
        ]);

        $value = $request->input('value');
        $existingVote = $comment->votes()->firstWhere('user_id', Auth::id());

        if ($existingVote) {
            if ($existingVote->vote === $value) {
                $existingVote->delete();

                $value === 1
                    ? $comment->decrement('vote_count')
                    : $comment->increment('vote_count');
            } else {
                $existingVote->update(['vote' => $value]);

                $value === 1
                    ? $comment->increment('vote_count', 2)
                    : $comment->decrement('vote_count', 2);
            }
        } else {
            $comment->votes()->create(['user_id' => Auth::id(), 'vote' => $value]);

            $value === 1
                ? $comment->increment('vote_count')
                : $comment->decrement('vote_count');
        }

        return back();
    }
}
