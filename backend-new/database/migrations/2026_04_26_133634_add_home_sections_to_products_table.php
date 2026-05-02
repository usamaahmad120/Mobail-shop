<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->boolean('is_newest')->default(false);

            $table->boolean('is_trending')->default(false);

            $table->boolean('is_mens_fashion')->default(false);

            $table->boolean('is_featured')->default(false);

            $table->boolean('is_flash_sale')->default(false);

            $table->boolean('is_top_rated')->default(false);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropColumn([
                'is_newest',
                'is_trending',
                'is_mens_fashion',
                'is_featured',
                'is_flash_sale',
                'is_top_rated',
            ]);

        });
    }
};