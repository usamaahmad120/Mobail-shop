<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_price',
        'image',
        'stock',
        'rating',
        'review_count',
        'is_active',
        'is_newest',
        'is_trending',
        'is_mens_fashion',
        'is_featured',
        'is_flash_sale',
        'is_top_rated',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_newest' => 'boolean',
        'is_trending' => 'boolean',
        'is_mens_fashion' => 'boolean',
        'is_featured' => 'boolean',
        'is_flash_sale' => 'boolean',
        'is_top_rated' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'review_count' => 'integer',
        'stock' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
