<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use Inertia\Inertia;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    //
    public function index(Request $request) {

        $search = $request->input('search');
        
        $input =  $request->only(['search']);

        // If no search query, return all brands, otherwise filter by search query
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%'); // Include email search
                });
            })
           
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();
             // Adjust pagination as needed
            
        return inertia('Auth/Admin/Users/UsersIndex', [
            'users' => UserResource::collection($users), 
            'filters' => $input 
        ]);
    }

    public function toggleAdminRole (User $user) {

        $user->is_admin = !$user->is_admin;
        $user->save();

        return back()->with('success', 'User\'s role has been updated successfully.');
    }


}
