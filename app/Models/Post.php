<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property string $title
 * @property string $summary
 * @property string $body
 * @property string $searchable_body
 * @property string|null $preview_image
 * @property string|null $preview_caption
 * @property int $user_id
 * @property int $vote_count
 * @property int $reply_count
 * @property Carbon $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $archived_at
 * @property Carbon|null $deleted_at
 *
 * @property User|null $user
 * @property Collection<Comment> $comments
 * @property Collection<Vote> $votes
 * @property Collection<Media> $media
 */
final class Post extends Model
{
    protected $fillable = ['title', 'summary', 'body', 'searchable_body', 'preview_image', 'preview_caption', 'user_id', 'vote_count', 'reply_count', 'archived_at', 'deleted_at'];

    protected $dates = ['created_at', 'updated_at', 'archived_at', 'deleted_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Vote of the authenticated user on the post
     */
    public function userVote(): ?Vote
    {
        /** @var Vote|null $userVote */
        $userVote = $this->votes()->firstWhere('user_id', Auth::id());
        return $userVote;
    }
}
