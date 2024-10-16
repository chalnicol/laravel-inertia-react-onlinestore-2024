<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Rules\ValidParentCategory;
use App\Http\Resources\CategoryResource;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    //
    public function index(Request $request) {

        $search = $request->input('search');
        
        // If no search query, return all Categorys, otherwise filter by search query
        $categories = Category::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->with(['parent', 'children'])
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();
             // Adjust pagination as needed
            
        return inertia('Auth/Admin/Categories/CategoryIndex', [
            'items' => CategoryResource::collection($categories), 
            'filters' => $request->only(['search'])
        ]);
    }
    public function create()
    {
        return inertia('Auth/Admin/Categories/CategoryCreate', [ 
            'categories' => Category::with('allChildren')->select('id', 'name', 'parent_id')->whereNull('parent_id')->get()
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'parent_id' => 'nullable|integer|exists:categories,id',
        ]);

        $slug = Str::slug($request->name);

        Category::create([
            'name' => ucwords($request->name),
            'slug' => $slug,
            'parent_id' => $request->parent_id,
            'active' => $request->active
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        // return $category;

        return inertia('Auth/Admin/Categories/CategoryEdit', [
            'category' => $category->load(['parent']),
            'categories' => Category::with('allChildren')->select('id', 'name', 'parent_id')->whereNull('parent_id')->get()
        ]);
    }

    public function update(Request $request, Category $category)
    {
        
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => ['nullable', 'integer', 'exists:categories,id', new ValidParentCategory($category)],
        ]);

        $slug = Str::slug($request->name);

        $category->update([
            'name' => ucwords($request->name),
            'slug' => $slug,
            'parent_id' => $request->parent_id,
            'active' => $request->active
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
