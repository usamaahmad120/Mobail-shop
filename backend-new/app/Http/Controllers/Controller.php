<?php

namespace App\Http\Controllers;

use App\Models\Product;

class Controller
{
    public function home()
    {
        return response()->json([
            'newest' => Product::with('category')
                ->where('is_newest', true)
                ->latest()
                ->get(),

            'trending' => Product::with('category')
                ->where('is_trending', true)
                ->get(),

            'mens_fashion' => Product::with('category')
                ->where('is_mens_fashion', true)
                ->get(),

            'featured' => Product::with('category')
                ->where('is_featured', true)
                ->get(),

            'flash_sale' => Product::with('category')
                ->where('is_flash_sale', true)
                ->get(),

            'top_rated' => Product::with('category')
                ->where('is_top_rated', true)
                ->get(),
        ]);
    }
}