<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = ['user_id', 'votable_id', 'votable_type', 'vote'];

    public function votable() {
        return $this->morphTo();
    }
}
