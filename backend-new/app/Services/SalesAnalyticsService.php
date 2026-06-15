<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class SalesAnalyticsService
{
    private const REVENUE_ORDER_STATUSES = ['Delivered'];

    private const REVENUE_PAYMENT_STATUSES = ['Paid'];

    private const CANCELLED_ORDER_STATUSES = ['Cancelled'];

    private const PENDING_ORDER_STATUSES = ['Pending'];

    public function getSummary(array $filters = []): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($filters);

        $filteredOrders = $this->ordersInRange($startDate, $endDate);
        $revenueOrders = $this->revenueOrdersInRange($startDate, $endDate);

        $totalOrders = (clone $filteredOrders)->count();
        $validOrders = (clone $revenueOrders)->count();
        $totalSales = (float) (clone $revenueOrders)->sum('total');

        return [
            'total_sales_amount' => round($totalSales, 2),
            'today_sales' => round((float) $this->revenueOrdersInRange(now()->startOfDay(), now()->endOfDay())->sum('total'), 2),
            'this_month_sales' => round((float) $this->revenueOrdersInRange(now()->startOfMonth(), now()->endOfMonth())->sum('total'), 2),
            'this_year_sales' => round((float) $this->revenueOrdersInRange(now()->startOfYear(), now()->endOfYear())->sum('total'), 2),
            'total_orders' => $totalOrders,
            'delivered_orders' => (clone $filteredOrders)->where('order_status', 'Delivered')->count(),
            'pending_orders' => (clone $filteredOrders)->whereIn('order_status', self::PENDING_ORDER_STATUSES)->count(),
            'cancelled_orders' => (clone $filteredOrders)->whereIn('order_status', self::CANCELLED_ORDER_STATUSES)->count(),
            'average_order_value' => $validOrders > 0 ? round($totalSales / $validOrders, 2) : 0,
            'period' => $filters['period'] ?? 'last_30_days',
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
        ];
    }

    public function getDailySales(array $filters = []): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($filters);

        $salesByDate = $this->revenueOrdersInRange($startDate, $endDate)
            ->selectRaw('DATE(created_at) as sales_date, COALESCE(SUM(total), 0) as total_sales, COUNT(*) as orders_count')
            ->groupBy('sales_date')
            ->orderBy('sales_date')
            ->get()
            ->keyBy('sales_date');

        $labels = [];
        $sales = [];
        $orders = [];

        foreach (CarbonPeriod::create($startDate->copy()->startOfDay(), $endDate->copy()->startOfDay()) as $date) {
            $key = $date->toDateString();
            $row = $salesByDate->get($key);

            $labels[] = $date->format('M d');
            $sales[] = round((float) ($row->total_sales ?? 0), 2);
            $orders[] = (int) ($row->orders_count ?? 0);
        }

        return [
            'labels' => $labels,
            'sales' => $sales,
            'orders' => $orders,
        ];
    }

    public function getMonthlySales(array $filters = []): array
    {
        $year = isset($filters['year']) ? (int) $filters['year'] : (int) now()->year;
        $startDate = Carbon::create($year, 1, 1)->startOfDay();
        $endDate = Carbon::create($year, 12, 31)->endOfDay();

        $salesByMonth = $this->revenueOrdersInRange($startDate, $endDate)
            ->selectRaw('MONTH(created_at) as sales_month, COALESCE(SUM(total), 0) as total_sales, COUNT(*) as orders_count')
            ->groupBy('sales_month')
            ->orderBy('sales_month')
            ->get()
            ->keyBy('sales_month');

        $labels = [];
        $sales = [];
        $orders = [];

        for ($month = 1; $month <= 12; $month++) {
            $row = $salesByMonth->get($month);

            $labels[] = Carbon::create($year, $month, 1)->format('M');
            $sales[] = round((float) ($row->total_sales ?? 0), 2);
            $orders[] = (int) ($row->orders_count ?? 0);
        }

        return [
            'year' => $year,
            'labels' => $labels,
            'sales' => $sales,
            'orders' => $orders,
        ];
    }

    public function getOrderStatusBreakdown(array $filters = []): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($filters);

        $statuses = $this->ordersInRange($startDate, $endDate)
            ->select('order_status', DB::raw('COUNT(*) as orders_count'))
            ->groupBy('order_status')
            ->orderBy('order_status')
            ->pluck('orders_count', 'order_status');

        return [
            'labels' => $statuses->keys()->values()->all(),
            'counts' => $statuses->values()->map(fn ($value): int => (int) $value)->all(),
        ];
    }

    public function getTopProducts(array $filters = []): array
    {
        [$startDate, $endDate] = $this->resolveDateRange($filters);

        $products = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('products', 'products.id', '=', 'order_items.product_id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->whereNotIn('orders.order_status', self::CANCELLED_ORDER_STATUSES)
            ->where(function ($query): void {
                $query
                    ->whereIn('orders.order_status', self::REVENUE_ORDER_STATUSES)
                    ->orWhereIn('orders.payment_status', self::REVENUE_PAYMENT_STATUSES);
            })
            ->selectRaw('COALESCE(products.name, order_items.product_name) as product_name')
            ->selectRaw('SUM(order_items.quantity) as quantity_sold')
            ->selectRaw('SUM(order_items.subtotal) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('quantity_sold')
            ->limit(10)
            ->get();

        return [
            'labels' => $products->pluck('product_name')->all(),
            'quantities' => $products->pluck('quantity_sold')->map(fn ($value): int => (int) $value)->all(),
            'revenue' => $products->pluck('revenue')->map(fn ($value): float => round((float) $value, 2))->all(),
        ];
    }

    private function ordersInRange(Carbon $startDate, Carbon $endDate): Builder
    {
        return Order::query()->whereBetween('created_at', [$startDate, $endDate]);
    }

    private function revenueOrdersInRange(Carbon $startDate, Carbon $endDate): Builder
    {
        return $this->ordersInRange($startDate, $endDate)
            ->whereNotIn('order_status', self::CANCELLED_ORDER_STATUSES)
            ->where(function (Builder $query): void {
                $query
                    ->whereIn('order_status', self::REVENUE_ORDER_STATUSES)
                    ->orWhereIn('payment_status', self::REVENUE_PAYMENT_STATUSES);
            });
    }

    /**
     * @return array{Carbon, Carbon}
     */
    private function resolveDateRange(array $filters = []): array
    {
        $period = $filters['period'] ?? 'last_30_days';

        return match ($period) {
            'today' => [now()->startOfDay(), now()->endOfDay()],
            'last_7_days' => [now()->subDays(6)->startOfDay(), now()->endOfDay()],
            'this_month' => [now()->startOfMonth(), now()->endOfMonth()],
            'this_year' => [now()->startOfYear(), now()->endOfYear()],
            'custom' => [
                Carbon::parse($filters['start_date'] ?? now())->startOfDay(),
                Carbon::parse($filters['end_date'] ?? now())->endOfDay(),
            ],
            default => [now()->subDays(29)->startOfDay(), now()->endOfDay()],
        };
    }
}
