<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // Brand::factory()->count(100)->create();

        $brands = [
            'Nike', 
            'Adidas', 
            'Puma', 
            'Under Armour', 
            'Reebok', 
            'Coca-cola', 
            'Lays', 
            'Cheetos',
            'Surf',
            'Tide',
        ];

        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand,
                'slug' => Str::slug($brand),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
