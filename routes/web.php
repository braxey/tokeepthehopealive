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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

/** ******************
 |       Posts      |
 * *************** **/
Route::prefix('posts')->middleware(['auth'])->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('posts.index');
    Route::get('/{post}', [PostController::class, 'show'])->where('post', '[0-9]+')->name('posts.show');

    Route::middleware(['can_post'])->group(function () {
        Route::get('/create', [PostController::class, 'showCreatePage'])->name('posts.create');
        Route::post('/', [PostController::class, 'store'])->name('posts.store');

        Route::get('/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
        Route::post('/{post}', [PostController::class, 'update'])->name('posts.update');
    });

    /** ******************
     |     Comments     |
        * *************** **/
    Route::post('/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
});

/** ******************
 |       Votes      |
 * *************** **/
Route::middleware(['auth'])->group(function () {
    Route::post('/comments/{comment}/vote', [VoteController::class, 'voteComment'])->name('comments.vote');
    Route::post('/posts/{post}/vote', [VoteController::class, 'votePost'])->name('posts.vote');
});

/** ******************
 |     Settings     |
 * *************** **/
require __DIR__.'/settings.php';

/** ******************
 |       Auth       |
 * *************** **/
require __DIR__.'/auth.php';
