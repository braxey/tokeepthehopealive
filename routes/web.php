<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', action: [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/more-posts', [DashboardController::class, 'morePosts'])->name(name: 'more.posts');
    Route::get('/search', [DashboardController::class, 'search'])->name('posts.search');
    Route::get('/posts/{post}/comments', [CommentController::class, 'index'])->name('comments.index');

    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
});

Route::post('/vote/{type}/{id}', [VoteController::class, 'vote'])->name('vote');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
