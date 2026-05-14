<?php

namespace App\Filament\Resources\Orders;

use App\Filament\Resources\Orders\Pages;
use App\Models\Order;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string | BackedEnum | null $navigationIcon =
        'heroicon-o-shopping-bag';

    protected static ?string $navigationLabel = 'Orders';

    protected static string | UnitEnum | null $navigationGroup =
        'Shop Management';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([

            Select::make('order_status')
                ->options([
                    'Pending' => 'Pending',
                    'Shipped' => 'Shipped',
                    'Delivered' => 'Delivered',
                    'Cancelled' => 'Cancelled',
                ])
                ->required(),

            Select::make('payment_status')
                ->options([
                    'Pending' => 'Pending',
                    'Paid' => 'Paid',
                ])
                ->required(),

            Textarea::make('notes')
                ->rows(4),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('id')
                    ->label('Order ID')
                    ->sortable(),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('phone'),

                TextColumn::make('city'),

                TextColumn::make('total')
                    ->label('Total (PKR)')
                    ->formatStateUsing(fn ($state): string => 'Rs ' . number_format((float) $state, 2))
                    ->sortable(),

                BadgeColumn::make('order_status')
                    ->colors([
                        'warning' => 'Pending',
                        'info' => 'Shipped',
                        'success' => 'Delivered',
                        'danger' => 'Cancelled',
                    ]),

                BadgeColumn::make('payment_status')
                    ->colors([
                        'warning' => 'Pending',
                        'success' => 'Paid',
                    ]),

                TextColumn::make('created_at')
                    ->dateTime('d M Y'),
            ])
            ->defaultSort('id', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
