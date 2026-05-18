<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $categories = collect([
            'Laptops',
            'Gaming Laptops',
            'Smartphones',
            'Tablets',
        ])->mapWithKeys(function (string $name) {
            return [
                $name => Category::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name, 'is_active' => true]
                ),
            ];
        });

        $products = [
            ['Laptops', 'Dell XPS 13 Plus', 355000, 329999, 8, true, true, true],
            ['Laptops', 'MacBook Air M2', 339999, 319999, 5, true, false, true],
            ['Gaming Laptops', 'Asus TUF F15 RTX 4060', 389999, 359999, 4, true, true, true],
            ['Gaming Laptops', 'Lenovo Legion 5 Pro', 459999, 429999, 3, false, true, true],
            ['Smartphones', 'Samsung Galaxy S Series', 289999, 269999, 12, true, true, false],
            ['Smartphones', 'iPhone Pro Max', 499999, null, 6, false, true, true],
            ['Tablets', 'iPad Air M2', 249999, 229999, 7, true, false, true],
            ['Tablets', 'Samsung Galaxy Tab S', 219999, 199999, 9, false, true, true],
        ];

        foreach ($products as [$categoryName, $name, $price, $discountPrice, $stock, $isNewest, $isTrending, $isShowcase]) {
            Product::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'category_id' => $categories[$categoryName]->id,
                    'name' => $name,
                    'description' => "{$name} with verified electronics warranty and reliable local support.",
                    'price' => $price,
                    'discount_price' => $discountPrice,
                    'stock' => $stock,
                    'rating' => 4.6,
                    'review_count' => 24,
                    'is_active' => true,
                    'is_newest' => $isNewest,
                    'is_trending' => $isTrending,
                    'is_electronics_showcase' => $isShowcase,
                    'is_featured' => $isShowcase,
                    'is_flash_sale' => $discountPrice !== null,
                    'is_top_rated' => true,
                ]
            );
        }
    }
}
