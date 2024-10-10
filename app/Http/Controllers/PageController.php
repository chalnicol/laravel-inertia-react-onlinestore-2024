<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;



use Inertia\Inertia;

class PageController extends Controller
{
    //
    public function welcome (Request $request) {

        $search = $request->input('search');
        
        $query = Product::query();

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhereHas('category', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                })
                ->orWhereHas('brand', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
        }

        // Apply ordering by 'updated_at' in descending order and paginate by 10
        $products = $query->with(['category', 'brand', 'tags', 'variants'])
                        ->orderBy('created_at', 'desc')
                        ->paginate(12)
                        ->withQueryString();

        return Inertia::render('Welcome', [
            'productListing' => $products,
            'categories' => Category::select('id', 'name')->get(),
            'brands'=> Brand::select('id', 'name')->get()
        ]);

      
    }

    public function show (Product $product) {

        

        return Inertia::render('ProductDetail' , [
            'product' => $product->load(['category', 'brand', 'variants']),
        ]);
    }

  

}
