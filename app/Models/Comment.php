<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property int $user_id
 * @property int $to_user_id
 * @property string $commentable_type
 * @property int $commentable_id
 * @property string $body
 * @property int $vote_count
 * @property int $reply_count
 * @property Carbon $created_at
 * @property Carbon|null $updated_at
 *
 * @property User|null $user
 * @property User|null $to_user
 * @property Collection<Comment> $comments
 * @property Collection<Vote> $votes
 */
final class Comment extends Model
{
    protected $fillable = ['user_id', 'to_user_id', 'commentable_type', 'commentable_id', 'body', 'vote_count', 'reply_count'];

    protected $dates = ['created_at', 'updated_at'];

    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function to_user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(self::class, 'commentable');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    /**
     * Vote of the authenticated user on the comment
     */
    public function userVote(): ?Vote
    {
        /** @var Vote|null $userVote */
        $userVote = $this->votes()->firstWhere('user_id', Auth::id());
        return $userVote;
    }
}
