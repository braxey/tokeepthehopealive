<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'body', 'user_id', 'preview_image'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function votes() {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function media() {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function voteCount() {
        return $this->votes->sum('vote');
    }
}
