<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required()
                    ->preload()
                    ->searchable()
                    ->label('Category'),

                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->reactive()
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)))
                    ->label('Product Name'),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->label('Slug'),

                Textarea::make('description')
                    ->rows(3)
                    ->columnSpanFull()
                    ->label('Description'),

                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rs')
                    ->minValue(0)
                    ->label('Price (PKR)'),

                TextInput::make('discount_price')
                    ->numeric()
                    ->prefix('Rs')
                    ->minValue(0)
                    ->label('Discount Price (PKR, Optional)'),

                TextInput::make('stock')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->default(0)
                    ->label('Stock Quantity'),

                TextInput::make('rating')
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(5)
                    ->step(0.1)
                    ->default(0)
                    ->label('Rating (0-5)'),

                TextInput::make('review_count')
                    ->numeric()
                    ->minValue(0)
                    ->default(0)
                    ->label('Review Count'),

                Toggle::make('is_active')
                    ->label('Active Product')
                    ->default(true),

                FileUpload::make('image')
                    ->image()
                    ->disk('public')
                    ->directory('products')
                    ->imagePreviewHeight('200')
                    ->required()
                    ->columnSpanFull()
                    ->label('Product Image'),

                Toggle::make('is_newest')
                    ->label('Show in Newest Products Section')
                    ->helperText('Display this product in the "Newest Products" section on homepage'),

                Toggle::make('is_trending')
                    ->label('Show in Trending Products Section')
                    ->helperText('Display this product in the "Trending Products" section on homepage'),

                Toggle::make('is_electronics_showcase')
                    ->label('Show in Electronics Showcase Section')
                    ->helperText('Display this product in the electronics showcase section on homepage'),

                Toggle::make('is_featured')
                    ->label('Show in Featured Products Section')
                    ->helperText('Display this product in the "Featured Products" section on homepage'),

                Toggle::make('is_flash_sale')
                    ->label('Show in Flash Sale Section')
                    ->helperText('Display this product in the "Flash Sale" section on homepage'),

                Toggle::make('is_top_rated')
                    ->label('Show in Top Rated Section')
                    ->helperText('Display this product in the "Top Rated" section on homepage'),

            ])
            ->statePath('data');
    }
}
