<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Tag;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        $name = $this->faker->unique()->word . ' ' . $this->faker->randomNumber(3);

        $price = $this->faker->randomFloat(2, 5, 1000);

        $options = ['visible', 'draft', 'hidden'];


        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence(),
            'quantity' => rand(5, 30),
            'sku' => Carbon::now()->timestamp . $this->faker->randomNumber(6),
            'category_id' => rand(1, 6), // Adjust as per existing category IDs
            'brand_id' => rand(1, 10), // Adjust as per existing brand IDs
            'cost_price' => $price - ($price*0.2),
            'visibility' => $options[ rand(0,2) ],
            'base_price' => $price,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
        
    }
 
    // Attach tags after creating a product
    public function configure()
    {
        return $this->afterCreating(function ($product) {
            // Fake tag IDs (e.g., between 1 and 10) to be synced to the product
            $tagIds = Tag::inRandomOrder()->take(rand(1, 5))->pluck('id')->toArray();
            $product->tags()->sync($tagIds); // Sync tags to the product
        });
    }
}
