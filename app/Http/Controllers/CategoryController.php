<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    //
    public function index(Request $request) {

        $search = $request->input('search');
        
        $input =  $request->only(['search']);

        // If no search query, return all Categorys, otherwise filter by search query
        $categories = Category::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->with(['products'])
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();
             // Adjust pagination as needed
            
        return inertia('Auth/Admin/Categories/CategoryIndex', ['items' => $categories, 'filters' => $input ]);
    }
    public function create()
    {
        return inertia('Auth/Admin/Categories/CategoryCreate');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $slug = Str::slug($request->name);

        Category::create([
            'name' => ucfirst($request->name),
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return inertia('Auth/Admin/Categories/CategoryEdit', ['category' => $category]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $slug = Str::slug($request->name);

        $category->update([
            'name' => ucfirst($request->name),
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }

    public function search (Request $request) {

        $search = $request->input('search');

        $categories = Category::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderByDesc('updated_at')
            ->take(10)
            ->get();

        return response()->json($categories);
    }

}
