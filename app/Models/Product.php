<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

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

    
    

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function hasVariants()
    {
        return $this->variants()->exists();
    }


    public function isInPromo()
    {
        if (!$this->promo_start || !$this->promo_end) {
            return false;
        }

        $currentDate = Carbon::now();
        $discountStart = Carbon::parse($this->promo_start);
        $discountEnd = Carbon::parse($this->promo_end);

        return $currentDate->between($discountStart, $discountEnd);
    }


    public function getSellingPriceAttribute () {

        if ( !$this->hasVariants() ) {
            if ($this->isInPromo() && $this->promo_discount) {
                return number_format($this->base_price - ($this->base_price * $this->promo_discount / 100), 2);
            }else {
                return number_format($this->base_price, 2);
            }
        }
        return null;
    }




}
