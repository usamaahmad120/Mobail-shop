<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\UsesSalesAnalyticsFilters;
use App\Services\SalesAnalyticsService;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

class TopProductsChart extends ChartWidget
{
    use InteractsWithPageFilters;
    use UsesSalesAnalyticsFilters;

    protected static bool $isDiscovered = false;

    protected ?string $heading = 'Top selling products';

    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = app(SalesAnalyticsService::class)->getTopProducts($this->analyticsFilters());

        return [
            'datasets' => [
                [
                    'label' => 'Quantity sold',
                    'data' => $data['quantities'],
                    'backgroundColor' => '#2563eb',
                    'borderColor' => '#2563eb',
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
