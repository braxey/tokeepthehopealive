<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Comment;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class CanDeleteCommentMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Comment $comment */
        $comment = $request->route('comment');
        $user = Auth::user();

        // Only a user with delete access or the author of the comment may delete the comment.
        if (! $user->permission->canDelete() && $user->id !== $comment->user_id) {
            return response()->json(status: Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
