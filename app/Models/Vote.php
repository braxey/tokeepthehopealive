<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Vote extends Model
{
    protected $fillable = ['user_id', 'votable_id', 'votable_type', 'vote'];

    public function votable(): MorphTo
    {
        return $this->morphTo();
    }
}
