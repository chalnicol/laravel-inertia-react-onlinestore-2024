<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $guarded = [];
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // A product belongs to a brand
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    // A product can have many tags (many-to-many relationship)
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
    public function hasVariants()
    {
        return $this->variants()->exists();
    }
}
