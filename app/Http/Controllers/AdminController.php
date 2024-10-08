<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
// use Inertia\Response;

class AdminController extends Controller
{
    //
    public function dashboard()
    {
        return Inertia::render('Auth/Admin/Dashboard');
    }
}
