<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Tag;
use Inertia\Inertia;

use App\Http\Resources\TagResource;

class TagController extends Controller
{
    //
    public function index(Request $request) {

        $search = $request->input('search');
        
        $input =  $request->only(['search']);

        $query = Tag::query();

        if ($search) {

            // If no search query, return all Categorys, otherwise filter by search query
            $query->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            });
        }
         // Apply ordering by 'updated_at' in descending order and paginate by 10
         $tags = $query->with(['products'])
            ->orderBy('updated_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        
            
        return inertia('Auth/Admin/Tags/TagIndex', [
            'items' => TagResource::collection($tags), 
            'filters' => $input 
        ]);
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('tags.index')->with('success', 'Tag deleted successfully.');
    }

}
