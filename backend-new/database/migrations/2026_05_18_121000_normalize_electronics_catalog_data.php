<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $categoryMap = [
            'leptop' => 'Laptops',
            'laptop' => 'Laptops',
            'mobail' => 'Smartphones',
            'mobile' => 'Smartphones',
            'men' => 'Gaming Laptops',
            'mens-fashion' => 'Gaming Laptops',
            'men-fashion' => 'Gaming Laptops',
        ];

        foreach ($categoryMap as $oldSlug => $newName) {
            DB::table('categories')
                ->where('slug', $oldSlug)
                ->update([
                    'name' => $newName,
                    'slug' => Str::slug($newName),
                    'is_active' => true,
                    'updated_at' => now(),
                ]);
        }

        foreach (['Laptops', 'Gaming Laptops', 'Smartphones', 'Tablets'] as $categoryName) {
            DB::table('categories')->updateOrInsert(
                ['slug' => Str::slug($categoryName)],
                [
                    'name' => $categoryName,
                    'is_active' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $categories = DB::table('categories')->pluck('id', 'slug');

        $productMap = [
            'leptop' => ['Laptops', 'Professional Laptop', 'professional-laptop'],
            'mobail-cover' => ['Smartphones', 'Smartphone Protective Case', 'smartphone-protective-case'],
            'shoes' => ['Gaming Laptops', 'Gaming Laptop Cooling Pad', 'gaming-laptop-cooling-pad'],
        ];

        foreach ($productMap as $oldSlug => [$categoryName, $name, $slug]) {
            DB::table('products')
                ->where('slug', $oldSlug)
                ->update([
                    'category_id' => $categories[Str::slug($categoryName)] ?? null,
                    'name' => $name,
                    'slug' => $slug,
                    'description' => "{$name} selected for Electra Shop electronics customers.",
                    'is_active' => true,
                    'updated_at' => now(),
                ]);
        }

        DB::table('categories')
            ->whereNotIn('slug', ['laptops', 'gaming-laptops', 'smartphones', 'tablets'])
            ->update([
                'is_active' => false,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        //
    }
};
