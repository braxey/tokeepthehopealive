<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
});

/** ******************
 |      Posts       |
 * *************** **/
Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('posts.index');
    Route::get('/{post}', [PostController::class, 'show'])->where('post', '[0-9]+');

    Route::middleware(['auth', 'can_post'])->group(function () {
        Route::get('/create', [PostController::class, 'showCreatePage'])->name('posts.create');
        Route::post('/', [PostController::class, 'store'])->name('posts.store');
    });
});

/** ******************
 |     Settings     |
 * *************** **/
require __DIR__.'/settings.php';

/** ******************
 |       Auth       |
 * *************** **/
require __DIR__.'/auth.php';
