<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;

use App\Http\Resources\ProductResource;

use Carbon\Carbon;
use Inertia\Inertia;

class PageController extends Controller
{
    //

    public function index(Request $request)
    {
        // Current date
        $currentDate = Carbon::now();
    
        // Example filter inputs
        $brandIds = $request->input('brands', []); 
        $categoryIds = $request->input('categories', []);
        $minPrice = $request->input('minPrice', null); 
        $maxPrice = $request->input('maxPrice', null);
        $searchTerm = $request->input('search', null); 
        $sortBy = $request->input('sortCriteria', 'date_desc'); 
        
        if (is_string($categoryIds)) {
            $categoryIds = explode(',', $categoryIds); // Converts '5,3' into [5, 3]
        }
        if (is_string($brandIds)) {
            $brandIds = explode(',', $brandIds); // Converts '5,3' into [5, 3]
        }

        // Query with filtering and sorting
        $products = Product::with(['brand', 'category', 'variants'])
            ->leftJoin('product_variants as variants', 'variants.product_id', '=', 'products.id')
            ->select('products.*')
            ->selectRaw("
                CASE
                    WHEN products.promo_start <= ? 
                        AND products.promo_end >= ? 
                        AND products.promo_discount IS NOT NULL
                    THEN
                        COALESCE(MIN(variants.variant_base_price) - (MIN(variants.variant_base_price) * (products.promo_discount / 100)), products.base_price - (products.base_price * (products.promo_discount / 100)))
                    ELSE
                        COALESCE(MIN(variants.variant_base_price), products.base_price) 
                END AS selling_price
            ", [$currentDate, $currentDate])
            ->groupBy('products.id')
            ->when(!empty($brandIds), fn($query) => $query->whereIn('products.brand_id', $brandIds))
            ->when(!empty($categoryIds), fn($query) => $query->whereIn('products.category_id', $categoryIds))
            ->when($searchTerm, function ($query, $searchTerm) {
                return $query->where(function ($query) use ($searchTerm) {
                    $query->where('products.name', 'LIKE', '%' . $searchTerm . '%')
                          ->orWhereHas('brand', fn($query) => $query->where('name', 'LIKE', '%' . $searchTerm . '%'));
                });
            })
            ->when($minPrice || $maxPrice, function ($query) use ($minPrice, $maxPrice) {
                if ($minPrice) {
                    $query->having('selling_price', '>=', $minPrice);
                }
    
                if ($maxPrice) {
                    $query->having('selling_price', '<=', $maxPrice);
                }
            })
            ->when($sortBy === 'date_desc', fn($query) => $query->orderBy('products.created_at', 'desc'))
            ->when($sortBy === 'date_asc', fn($query) => $query->orderBy('products.created_at', 'asc'))
            ->when($sortBy === 'price_desc', function ($query) use ($currentDate) {
                return $query->orderByRaw("
                    CASE
                        WHEN products.promo_start <= ? 
                            AND products.promo_end >= ? 
                            AND products.promo_discount IS NOT NULL
                        THEN
                            COALESCE(MIN(variants.variant_base_price) - (MIN(variants.variant_base_price) * (products.promo_discount / 100)), products.base_price - (products.base_price * (products.promo_discount / 100)))
                        ELSE
                            COALESCE(MIN(variants.variant_base_price), products.base_price) 
                    END DESC
                ", [$currentDate, $currentDate]);
            })
            ->when($sortBy === 'price_asc', function ($query) use ($currentDate) {
                return $query->orderByRaw("
                    CASE
                        WHEN products.promo_start <= ? 
                            AND products.promo_end >= ? 
                            AND products.promo_discount IS NOT NULL
                        THEN
                            COALESCE(MIN(variants.variant_base_price) - (MIN(variants.variant_base_price) * (products.promo_discount / 100)), products.base_price - (products.base_price * (products.promo_discount / 100)))
                        ELSE
                            COALESCE(MIN(variants.variant_base_price), products.base_price) 
                    END ASC
                ", [$currentDate, $currentDate]);
            })
            ->paginate(16)
            ->withQueryString();
    
        // Return the transformed collection with filters
        return Inertia::render('MainPage', [
            'products' => ProductResource::collection($products),
            'filters' => $request->only(['brands', 'categories', 'minPrice', 'maxPrice', 'search', 'sortCriteria']),
        ]);
    }
    

    
    public function welcome (Request $request) {

       
        $products = Product::with(['brand', 'category', 'variants'])
        ->paginate(15);

        return Inertia::render('Welcome', [
            'products' => ProductResource::collection($products)
        ]);

    }

     // Endpoint to fetch categories
    public function getFilters () 
    {
        $categories = Category::with('allChildren')->select('id', 'name', 'parent_id')->whereNull('parent_id')->get(); // Get only top-level categories

        
        return response()->json([
            'categories' => $categories,
            'brands'=> Brand::select('id', 'name')->get()
        ]);
    }

  
    public function show (Product $product) 
    {

        return Inertia::render('ProductDetail' , [
            'product' => new ProductResource($product->load(['variants', 'tags', 'category','brand']))
        ]);

    }

    


  

}
