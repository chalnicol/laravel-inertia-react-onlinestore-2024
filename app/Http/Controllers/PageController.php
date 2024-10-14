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
    

    
    
    public function welcome(Request $request)
    {
        // Retrieve the search and filter inputs from the request
        $search = $request->input('search');
        $categories = $request->input('categories', []);
        $brands = $request->input('brands', []);
        $minPrice = $request->input('minPrice');
        $maxPrice = $request->input('maxPrice');
        $sortCriteria = $request->input('sortCriteria');

        // Convert category and brand inputs to arrays if they are comma-separated strings
        if (is_string($categories)) {
            $categories = explode(',', $categories); // Converts '5,3' into [5, 3]
        }
        if (is_string($brands)) {
            $brands = explode(',', $brands); // Converts '5,3' into [5, 3]
        }

        // Start building the query
        $query = Product::query();

        // Search logic
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    })
                    ->orWhereHas('brand', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        // Filter by categories
        if (!empty($categories)) {
            $query->whereIn('category_id', $categories);
        }

        // Filter by brands
        if (!empty($brands)) {
            $query->whereIn('brand_id', $brands);
        }

        // Filter by price range
        if ($minPrice && $maxPrice && $minPrice !== '' && $maxPrice !== '') {
            $maxPrice = $maxPrice < $minPrice ? $minPrice : $maxPrice; // Ensure maxPrice is not less than minPrice

            $query->where(function ($q) use ($minPrice, $maxPrice) {
                $q->whereHas('variants', function ($query) use ($minPrice, $maxPrice) {
                    $query->whereBetween('variant_base_price', [$minPrice, $maxPrice]);
                })
                ->orWhere(function ($query) use ($minPrice, $maxPrice) {
                    $query->whereBetween('base_price', [$minPrice, $maxPrice]);
                });
            });
        } elseif ($minPrice && $minPrice !== '') {
            $query->where(function ($q) use ($minPrice) {
                $q->whereHas('variants', function ($query) use ($minPrice) {
                    $query->where('variant_base_price', '>=', $minPrice);
                })
                ->orWhere(function ($query) use ($minPrice) {
                    $query->where('base_price', '>=', $minPrice);
                });
            });
        } elseif ($maxPrice && $maxPrice !== '') {
            $query->where(function ($q) use ($maxPrice) {
                $q->whereHas('variants', function ($query) use ($maxPrice) {
                    $query->where('variant_base_price', '<=', $maxPrice);
                })
                ->orWhere(function ($query) use ($maxPrice) {
                    $query->where('base_price', '<=', $maxPrice);
                });
            });
        }

        // Sorting logic
        switch ($sortCriteria) {
            case 'date_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'date_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'price_asc':
                $query->selectRaw('products.*, COALESCE((SELECT MIN(variant_base_price) FROM product_variants WHERE product_variants.product_id = products.id), products.base_price) as sort_price')
                    ->orderBy('sort_price', 'asc');
                break;
            case 'price_desc':
                $query->selectRaw('products.*, COALESCE((SELECT MIN(variant_base_price) FROM product_variants WHERE product_variants.product_id = products.id), products.base_price) as sort_price')
                    ->orderBy('sort_price', 'desc');
                break;
            default: 
                $query->orderBy('created_at', 'desc');
        }

        // Execute the query and paginate the results
        $products = $query
            ->with(['variants', 'tags', 'brand', 'category'])
            ->paginate(16);
            // ->withQueryString(); // Preserve query string for filtering

        // Return the response to Inertia
        return Inertia::render('MainPage', [
            'products' => ProductResource::collection($products),
            'filters' => $request->only('search', 'categories', 'brands', 'minPrice', 'maxPrice', 'sortCriteria')
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
