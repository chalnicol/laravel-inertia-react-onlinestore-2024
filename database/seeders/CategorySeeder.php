<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // Category::factory()->count(100)->create();

        $categories = [
            'Health & Beauty', 
            'Household & Kitchen', 
            'Fresh Fruits & Vegetable', 
            'Fresh Meat & Seafood', 
            'Food & Beverages', 
            'Uncategorized'
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => Str::slug($category),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

       
    }
}


