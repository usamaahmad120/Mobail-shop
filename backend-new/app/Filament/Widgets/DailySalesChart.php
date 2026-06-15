<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\UsesSalesAnalyticsFilters;
use App\Services\SalesAnalyticsService;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

class DailySalesChart extends ChartWidget
{
    use InteractsWithPageFilters;
    use UsesSalesAnalyticsFilters;

    protected static bool $isDiscovered = false;

    protected ?string $heading = 'Daily sales';

    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = app(SalesAnalyticsService::class)->getDailySales($this->analyticsFilters());

        return [
            'datasets' => [
                [
                    'label' => 'Sales',
                    'data' => $data['sales'],
                    'borderColor' => '#d97706',
                    'backgroundColor' => 'rgba(217, 119, 6, 0.12)',
                    'fill' => true,
                    'tension' => 0.35,
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
