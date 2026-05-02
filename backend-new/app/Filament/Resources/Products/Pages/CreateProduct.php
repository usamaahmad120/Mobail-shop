<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Debug first (remove after checking)
        // dd($data);

        // Ensure category_id exists
        if (!isset($data['category_id'])) {
            throw new \Exception('Category is required but missing.');
        }

        // Auto-generate slug
        if (!isset($data['slug']) && isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $data;
    }
}