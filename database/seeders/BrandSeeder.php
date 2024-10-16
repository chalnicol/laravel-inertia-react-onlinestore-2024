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
    
        $brands = [
            "Nike",
            "Adidas",
            "Puma",
            "Under Armour",
            "Reebok",
            "Li-Ning",
            "San Miguel Corporation",
            "Ginebra San Miguel",
            "Tanduay Distillers",
            "Emperador Distillers",
            "Philippine Tanduay",
            "Chivas Regal",
            "Johnnie Walker",
            "Jack Daniel's",
            "Barefoot Wine",
            "Wolf Blass",
            "Jacob's Creek",
            "Concha y Toro",
            "Robert Mondavi",
            "Yellow Tail",
            "Almaviva",
            "Bodega Sietecueros",
            "La Vie Parisienne",
            "Bodega Aye",
            "Mang Inasal",
            "Jollibee",
            "Max's Restaurant",
            "Del Monte",
            "Magnolia",
            "Purefoods",
            "Nestlé Philippines",
            "NutriAsia",
            "Bounty Fresh",
            "Datu Puti",
            "Mang Tomas",
            "Lucky Me!",
            "Nissin"
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
