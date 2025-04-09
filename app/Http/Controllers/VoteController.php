<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    /**
     * Vote on a post.
     */
    public function onPost(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'value' => 'required|in:1',
        ]);

        $value = $request->input('value');
        $existingVote = $post->votes()->firstWhere('user_id', Auth::id());

        // If the user has already voted on this post.
        if ($existingVote) {
            // Delete the vote entry.
            $existingVote->delete();

            // Remove the previous vote from the post's vote count.
            $value === 1
                ? $post->decrement('vote_count')
                : $post->increment('vote_count');

            // If the user has not previously voted on the post.
        } else {
            // Create the vote entry.
            $post->votes()->create(['user_id' => Auth::id(), 'vote' => $value]);

            // Update the post's vote count.
            $value === 1
                ? $post->increment('vote_count')
                : $post->decrement('vote_count');
        }

        return back();
    }

    /**
     * Vote on a comment.
     */
    public function onComment(Request $request, Comment $comment): RedirectResponse
    {
        $request->validate([
            'value' => 'required|in:1,-1',
        ]);

        $value = $request->input('value');
        $existingVote = $comment->votes()->firstWhere('user_id', Auth::id());

        // If the user has already voted on this comment.
        if ($existingVote) {
            // If the user's previous vote on the comment is the same as the submitted vote.
            if ($existingVote->vote === $value) {
                // Delete the vote entry.
                $existingVote->delete();

                // Remove the previous vote from the comment's vote count.
                $value === 1
                    ? $comment->decrement('vote_count')
                    : $comment->increment('vote_count');

                // If the user's previous vote on the comment is not the same as the submitted vote.
            } else {
                // Update the existing vote entry.
                $existingVote->update(['vote' => $value]);

                // Change the comment's vote count by 2 to offset the previous opposite vote.
                $value === 1
                    ? $comment->increment('vote_count', 2)
                    : $comment->decrement('vote_count', 2);
            }

            // If the user has not previously voted on the comment.
        } else {
            // Create the vote entry.
            $comment->votes()->create(['user_id' => Auth::id(), 'vote' => $value]);

            // Update the comment's vote count.
            $value === 1
                ? $comment->increment('vote_count')
                : $comment->decrement('vote_count');
        }

        return back();
    }
}
