<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getSellingPriceAttribute ()
    {
        if ($this->product->isInPromo()) {
            return number_format($this->variant_base_price - ($this->variant_base_price * $this->product->promo_discount / 100), 2);
        }

        return number_format($this->variant_base_price, 2);
    }


}
