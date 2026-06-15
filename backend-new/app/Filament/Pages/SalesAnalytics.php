<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\DailySalesChart;
use App\Filament\Widgets\MonthlySalesChart;
use App\Filament\Widgets\OrderStatusChart;
use App\Filament\Widgets\SalesStatsOverview;
use App\Filament\Widgets\TopProductsChart;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Pages\Dashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\Widget;
use Filament\Widgets\WidgetConfiguration;
use Illuminate\Contracts\Support\Htmlable;

class SalesAnalytics extends Dashboard
{
    use HasFiltersForm;

    protected static ?string $slug = 'sales-analytics';

    protected static string $routePath = '/sales-analytics';

    protected static string|\UnitEnum|null $navigationGroup = 'Reports';

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::ChartBar;

    protected static ?string $navigationLabel = 'Sales Analytics';

    protected static ?int $navigationSort = 10;

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->isAdmin();
    }

    public function persistsFiltersInSession(): bool
    {
        return false;
    }

    public function getTitle(): string|Htmlable
    {
        return 'Sales Analytics';
    }

    public function filtersForm(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('period')
                ->label('Period')
                ->options([
                    'today' => 'Today',
                    'last_7_days' => 'Last 7 days',
                    'last_30_days' => 'Last 30 days',
                    'this_month' => 'This month',
                    'this_year' => 'This year',
                    'custom' => 'Custom date range',
                ])
                ->default('last_30_days')
                ->live(),

            DatePicker::make('start_date')
                ->label('Start date')
                ->visible(fn (Get $get): bool => $get('period') === 'custom'),

            DatePicker::make('end_date')
                ->label('End date')
                ->visible(fn (Get $get): bool => $get('period') === 'custom'),
        ]);
    }

    /**
     * @return array<class-string<Widget>|WidgetConfiguration>
     */
    public function getWidgets(): array
    {
        return [
            SalesStatsOverview::class,
            DailySalesChart::class,
            MonthlySalesChart::class,
            OrderStatusChart::class,
            TopProductsChart::class,
        ];
    }
}
