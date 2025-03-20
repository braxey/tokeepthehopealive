<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['post_id', 'user_id', 'body'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function post() {
        return $this->belongsTo(Post::class);
    }

    public function votes() {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function voteCount() {
        return $this->votes->sum('vote');
    }
}
