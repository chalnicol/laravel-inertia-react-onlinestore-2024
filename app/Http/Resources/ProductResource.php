<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'image' => $this->image,
            'name' => $this->name,
            // 'cost_price' => $this->cost_price,
            'base_price' => $this->base_price,
            'description' => $this->description,
            'quantity' => $this->quantity,
            'promo_discount' => $this->promo_discount,
            'promo_start' => $this->promo_start,
            'promo_end' => $this->promo_end,
            'is_promo' => $this->isInPromo(),
            'selling_price' => $this->selling_price,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants'))
        ];
    }
}
