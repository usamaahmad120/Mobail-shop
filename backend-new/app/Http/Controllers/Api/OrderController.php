<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function placeOrder(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'name' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'required',
            'items' => 'required|array',
        ]);

        $subtotal = 0;

        foreach ($request->items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $shipping = 200;
        $discount = 0;
        $total = $subtotal + $shipping - $discount;

        $order = Order::create([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'notes' => $request->notes,
            'subtotal' => $subtotal,
            'shipping_fee' => $shipping,
            'discount' => $discount,
            'total' => $total,
        ]);

      foreach ($request->items as $item) {
    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => is_numeric($item['id']) ? $item['id'] : null,
        'product_name' => $item['name'],
        'price' => $item['price'],
        'quantity' => $item['quantity'],
        'subtotal' => $item['price'] * $item['quantity'],
    ]);
}

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $order->id
        ]);
    }

    public function myOrders($id)
    {
        return Order::with('items')
            ->where('user_id', $id)
            ->latest()
            ->get();
    }
}