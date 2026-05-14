<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->sortable(),

                ImageColumn::make('image')
                    ->disk('public')
                    ->square(),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('category.name')
                    ->label('Category'),

                TextColumn::make('price')
                    ->label('Price (PKR)')
                    ->formatStateUsing(fn ($state): string => 'Rs ' . number_format((float) $state, 2)),

                TextColumn::make('stock')
                    ->badge()
                    ->color(fn ($state): string => (int) $state > 0 ? 'success' : 'danger'),

                TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state): string => number_format((float) $state, 1) . ' / 5'),

                TextColumn::make('review_count')
                    ->label('Reviews'),

                TextColumn::make('created_at')
                    ->date('d M Y'),
            ])

            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
