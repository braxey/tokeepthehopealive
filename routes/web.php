<?php

declare(strict_types=1);

use App\Http\Controllers\CommentController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\StaticController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StaticController::class, 'welcome'])->name('home');
Route::get('/privacy', [StaticController::class, 'privacyPolicy'])->name('privacy');
Route::get('/terms', [StaticController::class, 'termsOfService'])->name('terms');

/** ******************
 |       Posts      |
 * *************** **/
Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('posts.index');
    Route::get('/load-more', [PostController::class, 'getPostsPage'])->name('posts.load-more');
    Route::get('/{post}', [PostController::class, 'show'])->where('post', '[0-9]+')->name('posts.show');

    Route::middleware(['auth', 'verified', 'can_post'])->group(function () {
        Route::get('/create', [PostController::class, 'create'])->name('posts.create');
        Route::post('/', [PostController::class, 'store'])->name('posts.store');

        Route::get('/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
        Route::post('/{post}', [PostController::class, 'update'])->name('posts.update');

        Route::patch('/{post}', [PostController::class, 'archive'])->name('posts.archive');
        Route::delete('/{post}', [PostController::class, 'delete'])->name('posts.delete');
    });
});

/** ******************
 |     Comments     |
 * *************** **/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/comments/{comment}/comment', [CommentController::class, 'onComment'])->name('comments.comment');
    Route::post('/posts/{post}/comment', [CommentController::class, 'onPost'])->name('posts.comment');
});

Route::get('/comments/post/{post}', [CommentController::class, 'getComments'])->name('comments.post');
Route::get('/comments/{comment}', [CommentController::class, 'getReplies'])->name('comments.comment');

Route::middleware(['auth'])->group(function () {

    /** ******************
     |       Votes      |
    * *************** **/

    Route::post('/comments/{comment}/vote', [VoteController::class, 'onComment'])->name('comments.vote');
    Route::post('/posts/{post}/vote', [VoteController::class, 'onPost'])->name('posts.vote');

    /** ******************
     |       Media      |
    * *************** **/

    Route::post('/media/upload', [MediaController::class, 'upload'])->middleware('can_post')->name('media.upload');
});

/** ******************
 |     Settings     |
 * *************** **/
require __DIR__.'/settings.php';

/** ******************
 |       Auth       |
 * *************** **/
require __DIR__.'/auth.php';
