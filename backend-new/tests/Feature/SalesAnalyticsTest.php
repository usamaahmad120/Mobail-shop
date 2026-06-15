<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SalesAnalyticsTest extends TestCase
{
    public function test_admin_can_load_all_sales_analytics_endpoints(): void
    {
        $suffix = uniqid();
        $admin = null;
        $customer = null;
        $category = null;
        $product = null;
        $order = null;

        try {
            $admin = User::create([
                'name' => 'Analytics Admin',
                'email' => "analytics-admin-{$suffix}@example.com",
                'phone' => '031' . random_int(10000000, 99999999),
                'password' => bcrypt('secret123'),
                'role' => 'admin',
            ]);

            $customer = User::create([
                'name' => 'Analytics Customer',
                'email' => "analytics-customer-{$suffix}@example.com",
                'phone' => '032' . random_int(10000000, 99999999),
                'password' => bcrypt('secret123'),
                'role' => 'customer',
            ]);

            $category = Category::create([
                'name' => "Analytics Category {$suffix}",
                'slug' => "analytics-category-{$suffix}",
                'is_active' => true,
            ]);

            $product = Product::create([
                'category_id' => $category->id,
                'name' => "Analytics Product {$suffix}",
                'slug' => "analytics-product-{$suffix}",
                'description' => 'Analytics test product',
                'price' => 100,
                'discount_price' => null,
                'stock' => 10,
                'is_active' => true,
            ]);

            $order = Order::create([
                'user_id' => $customer->id,
                'name' => 'Analytics Customer',
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address' => 'Test address',
                'city' => 'Test city',
                'subtotal' => 200,
                'shipping_fee' => 0,
                'discount' => 0,
                'total' => 200,
                'payment_method' => 'Cash On Delivery',
                'payment_status' => 'Paid',
                'order_status' => 'Delivered',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => 100,
                'quantity' => 2,
                'subtotal' => 200,
            ]);

            Sanctum::actingAs($admin);

            foreach ([
                '/api/admin/sales-analytics/summary',
                '/api/admin/sales-analytics/daily-sales',
                '/api/admin/sales-analytics/monthly-sales',
                '/api/admin/sales-analytics/order-status',
                '/api/admin/sales-analytics/top-products',
            ] as $endpoint) {
                $this->getJson($endpoint)->assertOk();
            }
        } finally {
            if ($order) {
                OrderItem::where('order_id', $order->id)->delete();
                $order->delete();
            }

            $product?->delete();
            $category?->delete();
            $customer?->delete();
            $admin?->delete();
        }
    }

    public function test_customer_cannot_load_sales_analytics_endpoints(): void
    {
        $customer = User::create([
            'name' => 'Analytics Forbidden Customer',
            'email' => 'analytics-forbidden-' . uniqid() . '@example.com',
            'phone' => '033' . random_int(10000000, 99999999),
            'password' => bcrypt('secret123'),
            'role' => 'customer',
        ]);

        try {
            Sanctum::actingAs($customer);

            $this->getJson('/api/admin/sales-analytics/summary')->assertForbidden();
        } finally {
            $customer->delete();
        }
    }
}
