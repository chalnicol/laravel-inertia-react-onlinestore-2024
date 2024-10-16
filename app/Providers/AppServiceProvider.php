<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

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
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },
            'cartCount' => function () {
                // Get the cart from the session
                $cart = session()->get('cart', []);
                
                // Calculate the total quantity of items in the cart
                return array_reduce($cart, function ($carry, $item) {
                    return $carry + $item['quantity'];
                }, 0);
            }
        ]);
        
    }
}
