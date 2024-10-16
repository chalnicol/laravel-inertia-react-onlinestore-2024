<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    //
    public function index (Request $request) 
    {

        // Retrieve the cart from the session
        $cart = Session::get('cart', []);

        // Get the selected item IDs from the request
        $selectedItemIds = $request->input('selected_items', []);

        // Initialize total values
        $totalAmount = 0;
        $totalQuantity = 0;

        // Iterate through the cart and calculate the total for the selected items
        foreach ($cart as $item) {
            if (in_array($item['id'], $selectedItemIds)) {
                $totalAmount += $item['purchase_price'] * $item['quantity'];
                $totalQuantity += $item['quantity']; // Sum the quantities of the selected items
            }
        }

      
        return Inertia::render('Cart', [
            'items' => $cart,
            'summary' => [
                'subTotal' => $totalAmount,
                'totalItems' => $totalQuantity
            ]

        ]);
    }

    public function addItem (Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'id' => 'required|integer',
            'name' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'purchase_price' => 'required|numeric',
            'variant' => 'nullable|array',
        ]);

        // Get the current cart from the session or initialize an empty array
        $cart = Session::get('cart', []);

        // Check if the item already exists in the cart
        $existingItemKey = array_search($validated['id'], array_column($cart, 'id'));

        if ($existingItemKey !== false) {
            // If the item exists, update the quantity
            $cart[$existingItemKey]['quantity'] += $validated['quantity'];
        } else {
            // Otherwise, add the new item to the cart
            $cart[] = [
                'id' => $validated['id'],
                'name' => $validated['name'],
                'quantity' => $validated['quantity'],
                'purchase_price' => $validated['purchase_price'],
                'variant' => $validated['variant'] ?? null,
            ];
        }

        // Save the updated cart back to the session
        session(['cart' => $cart]);

        return redirect()->back();
    }

    public function updateItem(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'id' => 'required|integer',
            'quantity' => 'required|integer|min:0', // Allow quantity of 0 to remove items
        ]);

        // Get the current cart from the session
        $cart = session()->get('cart', []);

        // Find the item in the cart
        $itemKey = array_search($validated['id'], array_column($cart, 'id'));

        if ($itemKey !== false) {
            // Update the quantity
            if ($validated['quantity'] === 0) {
                // If quantity is 0, remove the item
                unset($cart[$itemKey]);
            } else {
                // Otherwise, update the quantity
                $cart[$itemKey]['quantity'] = $validated['quantity'];
            }
        }

        // Reindex the cart array
        $cart = array_values($cart);

        // Save the updated cart back to the session
        session(['cart' => $cart]);

        return redirect()->back();
    }

    public function removeItems(Request $request)
    {

        // return $request;

        // Validate incoming request data
        $validated = $request->validate([
            'ids' => 'required|array',  // Ensure 'ids' is an array
            'ids.*' => 'integer',        // Each item in 'ids' should be an integer
        ]);

        // Get the current cart from the session
        $cart = session()->get('cart', []);

        // Filter out items whose IDs are in the validated 'ids' array
        $updatedCart = array_filter($cart, function ($item) use ($validated) {
            return !in_array($item['id'], $validated['ids']);
        });

        // Reindex the cart array
        $updatedCart = array_values($updatedCart);

        // Save the updated cart back to the session
        session(['cart' => $updatedCart]);

        return redirect()->back();
    }

   

    public function clearAll()
    {
        Session::forget('cart');
        return redirect()->back()->with('success', 'Cart cleared!');
    }
    
}
