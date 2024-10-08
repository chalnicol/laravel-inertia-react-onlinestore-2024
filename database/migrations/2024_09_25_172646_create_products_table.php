<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name')->unique();; // Name of the product
            $table->string('slug'); // Adding slug
            $table->text('description')->nullable(); // Description of the product
            $table->decimal('cost_price', 10, 2)->nullable(); // Price of the product
            $table->decimal('base_price', 10, 2)->nullable(); // Price of the product
            $table->decimal('promo_price', 10, 2)->nullable(); // Price of the product
            $table->dateTime('promo_start')->nullable(); 
            $table->dateTime('promo_end')->nullable(); 
            $table->string('visibility')->default('draft'); 
            $table->integer('quantity')->nullable(); // Number of the product
            $table->string('image')->nullable(); 
            $table->string('sku')->unique(); 
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Foreign key to categories table
            $table->foreignId('brand_id')->constrained()->onDelete('cascade'); // Foreign key to brands table
            $table->timestamps(); // Created at and Updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
