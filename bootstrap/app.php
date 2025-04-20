<?php

declare(strict_types=1);

use App\Http\Middleware\CanDeleteCommentMiddleware;
use App\Http\Middleware\CanDeleteMiddleware;
use App\Http\Middleware\CanPostMiddleware;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Sentry\Laravel\Integration;
use Symfony\Component\HttpFoundation\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustHosts(at: ['tokeepthehopealive.com', 'www.tokeepthehopealive.com'], subdomains: false);
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_HOST | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO
        );

        $middleware->encryptCookies(except: ['appearance']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'can_post' => CanPostMiddleware::class,
            'can_delete' => CanDeleteMiddleware::class,
            'can_delete_comment' => CanDeleteCommentMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        if (app()->isProduction()) {
            Integration::handles($exceptions);
        }

        $exceptions->renderable(function (Throwable $e) {
            logger()->error($e->getMessage() . ' -- ' . $e->getTraceAsString());
        });
    })->create();
