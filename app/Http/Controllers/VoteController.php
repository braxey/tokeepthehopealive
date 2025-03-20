<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller {
    public function vote(Request $request, $type, $id) {
        $request->validate([
            'vote' => 'required|in:1,-1', // 1 for upvote, -1 for downvote
        ]);

        // Determine the votable type
        $votable = $type === 'post' ? Post::findOrFail($id) : Comment::findOrFail($id);
        $userId = Auth::check() ? Auth::id() : null;

        // Check for existing vote
        $existingVote = Vote::where('votable_id', $id)
            ->where('votable_type', $type === 'post' ? Post::class : Comment::class)
            ->where('user_id', $userId)
            ->first();

        if ($existingVote) {
            $existingVote->update(['vote' => $request->vote]);
        } else {
            Vote::create([
                'user_id' => $userId,
                'votable_id' => $id,
                'votable_type' => $type === 'post' ? Post::class : Comment::class,
                'vote' => $request->vote,
            ]);
        }

        // Return updated vote count for the frontend
        $voteCount = $votable->voteCount();
        return response()->json(['vote_count' => $voteCount]);
    }
}
