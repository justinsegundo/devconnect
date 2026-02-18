<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiscussionController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\FlagController;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/discussions', [DiscussionController::class, 'index']);
Route::get('/discussions/{discussion}', [DiscussionController::class, 'show']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::get('/leaderboard', [UserController::class, 'leaderboard']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    Route::post('/discussions', [DiscussionController::class, 'store']);
    Route::put('/discussions/{discussion}', [DiscussionController::class, 'update']);
    Route::delete('/discussions/{discussion}', [DiscussionController::class, 'destroy']);
    
    Route::post('/discussions/{discussion}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    
    Route::post('/vote', [VoteController::class, 'vote']);
    
    Route::post('/flags', [FlagController::class, 'store']);
    
    Route::middleware('can:moderate,App\Models\User')->group(function () {
        Route::get('/flags', [FlagController::class, 'index']);
        Route::post('/flags/{flag}/review', [FlagController::class, 'review']);
    });
});