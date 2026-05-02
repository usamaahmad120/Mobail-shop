<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;



Route::get('/products/home', [ProductController::class, 'home']);
Route::post('/place-order', [OrderController::class, 'placeOrder']);
Route::get('/my-orders/{id}', [OrderController::class, 'myOrders']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
// Public API Routes for your React Frontend
Route::get('/categories', [ProductController::class, 'getCategories']);
Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/products/{slug}', [ProductController::class, 'getProductBySlug']);