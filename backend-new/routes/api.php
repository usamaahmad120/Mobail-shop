<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ProductReviewController;
use App\Http\Controllers\Api\Admin\SalesAnalyticsController;



Route::get('/products/home', [ProductController::class, 'home']);
Route::post('/place-order', [OrderController::class, 'placeOrder']);
Route::post('/product-reviews', [ProductReviewController::class, 'store']);
Route::post('/contact', [ContactController::class, 'send']);
Route::get('/my-orders/{id}', [OrderController::class, 'myOrders']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin/sales-analytics')
    ->group(function () {
        Route::get('/summary', [SalesAnalyticsController::class, 'summary']);
        Route::get('/daily-sales', [SalesAnalyticsController::class, 'dailySales']);
        Route::get('/monthly-sales', [SalesAnalyticsController::class, 'monthlySales']);
        Route::get('/order-status', [SalesAnalyticsController::class, 'orderStatus']);
        Route::get('/top-products', [SalesAnalyticsController::class, 'topProducts']);
    });

// Public API Routes for your React Frontend
Route::get('/categories', [ProductController::class, 'getCategories']);
Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('/products/{slug}', [ProductController::class, 'getProductBySlug']);
