<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function getCategories()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->select('id', 'name', 'slug', 'image')
            ->withCount(['products' => fn ($query) => $query->where('is_active', true)])
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function getProducts(Request $request)
    {
        try {
            $validated = $request->validate([
                'category' => ['nullable', 'string', 'max:120'],
                'search' => ['nullable', 'string', 'max:120'],
                'page' => ['nullable', 'integer', 'min:1'],
                'per_page' => ['nullable', 'integer', 'min:1', 'max:48'],
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'message' => 'Invalid product filter parameters.',
                'errors' => $exception->errors(),
            ], 422);
        }

        $query = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->whereHas('category', fn ($category) => $category->where('is_active', true))
            ->latest('products.created_at');

        if (! empty($validated['category'])) {
            $query->whereHas('category', function ($category) use ($validated) {
                $category
                    ->where('slug', $validated['category'])
                    ->orWhere('name', $validated['category']);
            });
        }

        if (! empty($validated['search'])) {
            $search = mb_strtolower($validated['search']);

            $query->where(function ($productQuery) use ($search) {
                $productQuery
                    ->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"])
                    ->orWhereHas('category', fn ($category) => $category->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]));
            });
        }

        $perPage = (int) ($validated['per_page'] ?? 12);
        $products = $query->paginate($perPage)->withQueryString();

        return response()->json([
            'data' => $products->getCollection()->map(fn ($product) => $this->formatProduct($product)),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function getProductBySlug(string $slug)
    {
        $product = Product::query()
            ->with('category:id,name,slug')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->whereHas('category', fn ($category) => $category->where('is_active', true))
            ->first();

        if (! $product) {
            return response()->json([
                'message' => 'Product not found.',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatProduct($product),
        ]);
    }

    public function home()
    {
        $baseQuery = Product::query()
            ->with('category:id,name,slug')
            ->where('is_active', true)
            ->whereHas('category', fn ($category) => $category->where('is_active', true));

        return response()->json([
            'data' => [
                'newest' => $this->sectionProducts($baseQuery, 'is_newest'),
                'trending' => $this->sectionProducts($baseQuery, 'is_trending'),
                'electronics_showcase' => $this->sectionProducts($baseQuery, 'is_electronics_showcase'),
                'featured' => $this->sectionProducts($baseQuery, 'is_featured'),
                'flash_sale' => $this->sectionProducts($baseQuery, 'is_flash_sale'),
                'top_rated' => $this->sectionProducts($baseQuery, 'is_top_rated'),
            ],
        ]);
    }

    private function sectionProducts($baseQuery, string $section)
    {
        return $baseQuery->clone()
            ->where($section, true)
            ->latest('products.created_at')
            ->limit(10)
            ->get()
            ->map(fn ($product) => $this->formatProduct($product));
    }

    private function formatProduct(Product $product): array
    {
        $stock = max((int) $product->stock, 0);
        $rating = min(max((float) ($product->rating ?? 0), 0), 5);
        $reviewCount = max((int) ($product->review_count ?? 0), 0);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => (float) $product->price,
            'discount_price' => $product->discount_price ? (float) $product->discount_price : null,
            'final_price' => (float) ($product->discount_price ?? $product->price),
            'image' => $product->image ? asset('storage/' . $product->image) : null,
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
