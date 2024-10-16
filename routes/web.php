<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\CartController;




use App\Http\Middleware\AdminMiddleware;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     if (Auth::check()) {
//         return redirect('/home');
//     }
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/home', function () {
//     return Inertia::render('Home');
// })->middleware(['auth', 'verified'])->name('home');


//public routes
// Route::get('/',  [PageController::class, 'index'])->name('welcome');
Route::get('/',  [PageController::class, 'welcome'])->name('welcome');


Route::get('/get_filters', [PageController::class, 'getFilters'])->name('welcome.getFilters');

Route::get('/product/{product}',  [PageController::class, 'show'])->name('product.show');




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/brands/search', [BrandController::class, 'search'])->name('brands.search');
    Route::get('/categories/search', [CategoryController::class, 'search'])->name('categories.search');

    Route::get('/cart',  [CartController::class, 'index'])->name('cart.index');

    Route::post('/cart/add',  [CartController::class, 'addItem'])->name('cart.add');
    Route::post('/cart/update',  [CartController::class, 'updateItem'])->name('cart.update');
    Route::post('/cart/remove',  [CartController::class, 'removeItems'])->name('cart.remove');

    // Route::delete('/cart/clear',  [CartController::class, 'clearAll'])->name('cart.clear');


    


});

Route::middleware(['auth', AdminMiddleware::class])->group(function () {

    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    Route::resource('/admin/brands', BrandController::class);
    Route::resource('/admin/categories', CategoryController::class);

    Route::resource('/admin/products', ProductController::class);

    Route::get('/admin/tags', [TagController::class, 'index'])->name('tags.index');
    Route::delete('/admin/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    Route::get('/admin/users', [UserController::class, 'index'])->name('users.index');
    Route::put('/admin/users/{user}', [UserController::class, 'toggleAdminRole'])->name('users.toggleRole');

});

require __DIR__.'/auth.php';
