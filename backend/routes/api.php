<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\CategoryController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Auth)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Buku
    Route::apiResource('books', BookController::class);
    Route::get('/categories', [CategoryController::class, 'index']);


    // Profil dan Logout
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Wishlist
    Route::get('/user/wishlist', [UserController::class, 'wishlist']);
    Route::post('/user/wishlist', [UserController::class, 'addToWishlist']);
    Route::delete('/user/wishlist/{bookId}', [UserController::class, 'removeFromWishlist']);

    // Cart
    Route::get('/user/cart', [UserController::class, 'cart']);
    Route::post('/user/cart', [UserController::class, 'addToCart']);
    Route::delete('/user/cart/{bookId}', [UserController::class, 'removeFromCart']);
});
