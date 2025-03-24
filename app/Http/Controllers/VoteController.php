<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller {
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
