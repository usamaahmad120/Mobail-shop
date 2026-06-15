<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SalesAnalyticsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'period' => ['nullable', 'string', 'in:today,last_7_days,last_30_days,this_month,this_year,custom'],
            'start_date' => ['required_if:period,custom', 'nullable', 'date'],
            'end_date' => ['required_if:period,custom', 'nullable', 'date', 'after_or_equal:start_date'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ];
    }

    public function filters(): array
    {
        return [
            'period' => $this->validated('period', 'last_30_days'),
            'start_date' => $this->validated('start_date'),
            'end_date' => $this->validated('end_date'),
            'year' => $this->validated('year'),
        ];
    }
}
