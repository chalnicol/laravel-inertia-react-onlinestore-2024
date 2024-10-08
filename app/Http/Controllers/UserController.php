<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    //
    public function index(Request $request) {

        $search = $request->input('search');
        
        $input =  $request->only(['search']);

        // If no search query, return all brands, otherwise filter by search query
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();
             // Adjust pagination as needed
            
        return inertia('Auth/Admin/Users/UsersIndex', ['users' => $users, 'filters' => $input ]);
    }

    public function toggleAdminRole (User $user) {

        $user->is_admin = !$user->is_admin;
        $user->save();

        return back()->with('success', 'User\'s role has been updated successfully.');
    }


}
