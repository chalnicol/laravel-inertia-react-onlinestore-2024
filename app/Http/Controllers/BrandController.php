<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Brand;
use Inertia\Inertia;

class BrandController extends Controller
{
    //
    public function index(Request $request) {

        $search = $request->input('search');
        
        $input =  $request->only(['search']);

        // If no search query, return all brands, otherwise filter by search query
        $brands = Brand::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->with(['products'])
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();
             // Adjust pagination as needed
            
        return inertia('Auth/Admin/Brands/BrandIndex', ['brands' => $brands, 'filters' => $input ]);
    }
    public function create()
    {
        return inertia('Auth/Admin/Brands/BrandCreate');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
        ]);

        $slug = Str::slug($request->name);

        Brand::create([
            'name' => ucfirst($request->name),
            'slug' => $slug,
        ]);

        return redirect()->route('brands.index')->with('success', 'Brand created successfully.');
    }

    public function edit(Brand $brand)
    {
        return inertia('Auth/Admin/Brands/BrandEdit', ['brand' => $brand]);
    }

    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
        ]);

        $slug = Str::slug($request->name);

        $brand->update([
            'name' => ucfirst($request->name),
            'slug' => $slug,
        ]);

        return redirect()->route('brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->route('brands.index')->with('success', 'Brand deleted successfully.');
    }

    public function search (Request $request) {

        $search = $request->input('search');

        $brands = Brand::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderByDesc('updated_at')
            ->take(10)
            ->get();

        return response()->json($brands);
    }

}
