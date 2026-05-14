<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // ✅ Get all categories
    public function getCategories()
    {
        return response()->json(Category::select('id', 'name', 'slug')->get());
    }

    // ✅ Get all products (with optional category filter)
    public function getProducts(Request $request)
    {
        $query = Product::with('category')
            ->where('is_active', 1)
            ->latest();

        // 🔥 Filter by category (IMPORTANT)
        if ($request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $products = $query->get();

        // Debug: Log how many products found
        \Log::info('Products API called', [
            'total_active' => Product::where('is_active', 1)->count(),
            'total_all' => Product::count(),
            'returned' => $products->count(),
            'category_filter' => $request->category
        ]);

        return response()->json($products->map(fn($product) => $this->formatProduct($product)));
    }

    // ✅ Get single product
    public function getProductBySlug($slug)
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('is_active', 1)
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json($this->formatProduct($product));
    }

    // 🔥 NEW: Get homepage sections (grouped products)
    public function home()
    {
        $baseQuery = Product::with('category')->where('is_active', 1);

        return response()->json([
            'newest' => $baseQuery->clone()
                ->where('is_newest', 1)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($product) => $this->formatProduct($product)),

            'trending' => $baseQuery->clone()
                ->where('is_trending', 1)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($product) => $this->formatProduct($product)),

            'mens_fashion' => $baseQuery->clone()
                ->where('is_mens_fashion', 1)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($product) => $this->formatProduct($product)),

            'featured' => $baseQuery->clone()
                ->where('is_featured', 1)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($product) => $this->formatProduct($product)),

            'flash_sale' => $baseQuery->clone()
                ->where('is_flash_sale', 1)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($product) => $this->formatProduct($product)),

            'top_rated' => $baseQuery->clone()
                ->where('is_top_rated', 1)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($product) => $this->formatProduct($product)),
        ]);
    }

    // 🔥 Reusable formatter (VERY IMPORTANT)
    private function formatProduct($product)
    {
        $stock = max((int) $product->stock, 0);
        $rating = min(max((float) ($product->rating ?? 0), 0), 5);
        $reviewCount = max((int) ($product->review_count ?? 0), 0);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => $product->price,
            'discount_price' => $product->discount_price,
            'final_price' => $product->discount_price ?? $product->price,
            'image' => $product->image 
                ? asset('storage/' . $product->image)
                : null,
            'stock' => $stock,
            'maxStock' => $stock,
            'is_in_stock' => $stock > 0,
            'stock_status' => $stock > 0 ? 'In Stock' : 'Out of Stock',
            'rating' => $rating,
            'review_count' => $reviewCount,
            'category' => [
                'name' => $product->category?->name,
                'slug' => $product->category?->slug,
            ],
        ];
    }
}
