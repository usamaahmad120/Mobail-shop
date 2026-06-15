<?php

namespace App\Filament\Widgets\Concerns;

trait UsesSalesAnalyticsFilters
{
    protected function analyticsFilters(): array
    {
        $filters = $this->pageFilters ?? [];
        $period = $filters['period'] ?? 'last_30_days';

        return [
            'period' => in_array($period, ['today', 'last_7_days', 'last_30_days', 'this_month', 'this_year', 'custom'], true)
                ? $period
                : 'last_30_days',
            'start_date' => $filters['start_date'] ?? null,
            'end_date' => $filters['end_date'] ?? null,
        ];
    }

    public static function canView(): bool
    {
        return (bool) auth()->user()?->isAdmin();
    }
}
