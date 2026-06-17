<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;
use Livewire\Mechanisms\FrontendAssets\FrontendAssets;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Livewire::setScriptRoute(function ($handle) {
            return Route::get('/livewire/livewire.js', $handle);
        });

        Route::get('/livewire.js', [FrontendAssets::class, 'returnJavaScriptAsFile']);
        Route::get('/livewire-{hash}/livewire.js', fn () => app(FrontendAssets::class)->returnJavaScriptAsFile())
            ->where('hash', '[A-Za-z0-9]+');
    }
}
