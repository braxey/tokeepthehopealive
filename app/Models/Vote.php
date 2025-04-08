<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string $votable_type
 * @property int $votable_id
 * @property int $vote
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Vote extends Model
{
    protected $fillable = ['user_id', 'votable_type', 'votable_id', 'vote'];

    protected $dates = ['created_at', 'updated_at'];

    public function votable(): MorphTo
    {
        return $this->morphTo();
    }
}
