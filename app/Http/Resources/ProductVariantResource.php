<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);

        return [
            'id' => $this->id,
            'variant_name' => $this->variant_name, 
            'variant_base_price' => $this->variant_base_price,
            'variant_is_promo' => $this->product->isInPromo(),
            'variant_selling_price' => $this->selling_price
        ];

    }
}
