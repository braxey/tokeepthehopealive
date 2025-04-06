<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property string $mediable_type
 * @property int $mediable_id
 * @property string $path
 * @property string $type // media or video
 * @property int $position
 * @property string|null $caption
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Media extends Model
{
    protected $fillable = ['mediable_type', 'mediable_id', 'path', 'type', 'position', 'caption'];
    protected $dates = ['created_at', 'updated_at'];

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
