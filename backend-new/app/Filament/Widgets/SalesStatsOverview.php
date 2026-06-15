<?php

namespace App\Filament\Widgets;

use App\Filament\Widgets\Concerns\UsesSalesAnalyticsFilters;
use App\Services\SalesAnalyticsService;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SalesStatsOverview extends StatsOverviewWidget
{
    use InteractsWithPageFilters;
    use UsesSalesAnalyticsFilters;

    protected static bool $isDiscovered = false;

    protected ?string $heading = 'Sales performance';

    protected int|string|array $columnSpan = 'full';

    protected function getStats(): array
    {
        $summary = app(SalesAnalyticsService::class)->getSummary($this->analyticsFilters());

        return [
            Stat::make('Total sales amount', $this->money($summary['total_sales_amount']))
                ->icon(Heroicon::CurrencyDollar)
                ->color('success'),
            Stat::make('Today sales', $this->money($summary['today_sales']))
                ->icon(Heroicon::CalendarDays)
                ->color('info'),
            Stat::make('This month sales', $this->money($summary['this_month_sales']))
                ->icon(Heroicon::Calendar)
                ->color('warning'),
            Stat::make('This year sales', $this->money($summary['this_year_sales']))
                ->icon(Heroicon::ChartBar)
                ->color('primary'),
            Stat::make('Total orders', $summary['total_orders'])
                ->icon(Heroicon::ShoppingBag),
            Stat::make('Delivered orders', $summary['delivered_orders'])
                ->icon(Heroicon::CheckCircle)
                ->color('success'),
            Stat::make('Pending orders', $summary['pending_orders'])
                ->icon(Heroicon::Clock)
                ->color('warning'),
            Stat::make('Cancelled orders', $summary['cancelled_orders'])
                ->icon(Heroicon::XCircle)
                ->color('danger'),
            Stat::make('Average order value', $this->money($summary['average_order_value']))
                ->icon(Heroicon::Calculator)
                ->color('info'),
        ];
    }

    private function money(float|int $value): string
    {
        return 'Rs ' . number_format((float) $value, 2);
    }
}
