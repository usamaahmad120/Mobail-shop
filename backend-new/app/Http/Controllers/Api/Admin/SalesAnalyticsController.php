<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SalesAnalyticsRequest;
use App\Services\SalesAnalyticsService;
use Illuminate\Http\JsonResponse;

class SalesAnalyticsController extends Controller
{
    public function __construct(private readonly SalesAnalyticsService $analytics)
    {
    }

    public function summary(SalesAnalyticsRequest $request): JsonResponse
    {
        return response()->json($this->analytics->getSummary($request->filters()));
    }

    public function dailySales(SalesAnalyticsRequest $request): JsonResponse
    {
        return response()->json($this->analytics->getDailySales($request->filters()));
    }

    public function monthlySales(SalesAnalyticsRequest $request): JsonResponse
    {
        return response()->json($this->analytics->getMonthlySales($request->filters()));
    }

    public function orderStatus(SalesAnalyticsRequest $request): JsonResponse
    {
        return response()->json($this->analytics->getOrderStatusBreakdown($request->filters()));
    }

    public function topProducts(SalesAnalyticsRequest $request): JsonResponse
    {
        return response()->json($this->analytics->getTopProducts($request->filters()));
    }
}
