<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\UsesSalesAnalyticsFilters;
use App\Services\SalesAnalyticsService;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

class OrderStatusChart extends ChartWidget
{
    use InteractsWithPageFilters;
    use UsesSalesAnalyticsFilters;

    protected static bool $isDiscovered = false;

    protected ?string $heading = 'Order status';

    protected int|string|array $columnSpan = 1;

    protected function getData(): array
    {
        $data = app(SalesAnalyticsService::class)->getOrderStatusBreakdown($this->analyticsFilters());

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $data['counts'],
                    'backgroundColor' => ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#64748b'],
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
