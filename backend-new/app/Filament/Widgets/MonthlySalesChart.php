<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\UsesSalesAnalyticsFilters;
use App\Services\SalesAnalyticsService;
use Filament\Widgets\ChartWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;

class MonthlySalesChart extends ChartWidget
{
    use InteractsWithPageFilters;
    use UsesSalesAnalyticsFilters;

    protected static bool $isDiscovered = false;

    protected ?string $heading = 'Monthly sales';

    protected int|string|array $columnSpan = 1;

    protected function getData(): array
    {
        $data = app(SalesAnalyticsService::class)->getMonthlySales(['year' => now()->year]);

        return [
            'datasets' => [
                [
                    'label' => 'Sales',
                    'data' => $data['sales'],
                    'backgroundColor' => '#0f766e',
                    'borderColor' => '#0f766e',
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
