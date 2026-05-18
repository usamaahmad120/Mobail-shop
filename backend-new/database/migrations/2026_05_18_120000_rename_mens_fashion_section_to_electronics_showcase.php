<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('products', 'is_mens_fashion') && ! Schema::hasColumn('products', 'is_electronics_showcase')) {
            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('is_mens_fashion', 'is_electronics_showcase');
            });
        }

        if (! Schema::hasColumn('products', 'is_electronics_showcase')) {
            Schema::table('products', function (Blueprint $table) {
                $table->boolean('is_electronics_showcase')->default(false)->after('is_trending');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'is_electronics_showcase') && ! Schema::hasColumn('products', 'is_mens_fashion')) {
            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('is_electronics_showcase', 'is_mens_fashion');
            });
        }
    }
};
