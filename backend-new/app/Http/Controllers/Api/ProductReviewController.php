<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductReviewController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => ['required', 'integer', 'exists:users,id'],
                'order_id' => ['required', 'integer', 'exists:orders,id'],
                'order_item_id' => ['required', 'integer', 'exists:order_items,id'],
                'product_id' => ['required', 'integer', 'exists:products,id'],
                'rating' => ['required', 'integer', 'min:1', 'max:5'],
                'comment' => ['nullable', 'string', 'max:1000'],
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'message' => 'Invalid review details.',
                'errors' => $exception->errors(),
            ], 422);
        }

        $order = Order::query()
            ->where('id', $validated['order_id'])
            ->where('user_id', $validated['user_id'])
            ->first();

        if (! $order) {
            return response()->json([
                'message' => 'Order not found for this customer.',
            ], 404);
        }

        if ($order->order_status !== 'Delivered') {
            return response()->json([
                'message' => 'Product feedback is available after delivery only.',
            ], 403);
        }

        $orderItem = OrderItem::query()
            ->where('id', $validated['order_item_id'])
            ->where('order_id', $order->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if (! $orderItem) {
            return response()->json([
                'message' => 'This product was not found in the delivered order.',
            ], 404);
        }

        $review = DB::transaction(function () use ($validated, $order, $orderItem) {
            $review = ProductReview::updateOrCreate(
                [
                    'user_id' => $validated['user_id'],
                    'order_item_id' => $orderItem->id,
                ],
                [
                    'product_id' => $validated['product_id'],
                    'order_id' => $order->id,
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'] ?? null,
                    'is_approved' => true,
                ]
            );

            $this->refreshProductRating((int) $validated['product_id']);

            return $review;
        });

        return response()->json([
            'message' => 'Thank you. Your product feedback has been saved.',
            'data' => $review,
        ], $review->wasRecentlyCreated ? 201 : 200);
    }

    private function refreshProductRating(int $productId): void
    {
        $summary = ProductReview::query()
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->selectRaw('COALESCE(AVG(rating), 0) as rating, COUNT(*) as review_count')
            ->first();

        Product::query()
            ->where('id', $productId)
            ->update([
                'rating' => round((float) $summary->rating, 1),
                'review_count' => (int) $summary->review_count,
            ]);
    }
}
