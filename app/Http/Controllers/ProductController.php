<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

use App\Models\Product;
use App\Models\Tag;
use App\Models\ProductVariant;
use Carbon\Carbon;
use Inertia\Inertia;

class ProductController extends Controller
{
    //

   
    public function index(Request $request) {

        $search = $request->input('search');
        
        $query = Product::query();

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhereHas('category', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                })
                ->orWhereHas('brand', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
        }

        // Apply ordering by 'updated_at' in descending order and paginate by 10
        $products = $query->with(['category', 'brand', 'tags', 'variants'])
                        ->orderBy('updated_at', 'desc')
                        ->paginate(15)
                        ->withQueryString();

        return Inertia::render('Auth/Admin/Products/ProductIndex', [
            'items' => $products,
            'filters' => $request->only('search'),
        ]);

    }

    public function show (Product $product) {
        return Inertia::render('Auth/Admin/Products/ProductShow', [
            'product' => $product->load(['category', 'brand', 'variants', 'tags']),
        ]);
    }
    public function create()
    {
        return inertia('Auth/Admin/Products/ProductCreate');
    }

    public function store(Request $request)
    {
       
        $hasVariants = $request->filled('variants');


        $result  = $this->validateProductData($request);

        if (!$result['success']) {
            // If validation fails, you can handle errors here as needed
            return redirect()->back()->withErrors($result['errors'])->withInput();
        }

        //validate
        $validated = $result['data'];

        //generate product slug
        $slug = Str::slug($request->name);

        //generate product sku
        $sku = Carbon::now()->timestamp . rand(100000, 999999);

        // Create a directory for the product images if it doesn't exist
        $imageDir = 'products/prod_' . $sku;

        //initialize product image path
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $this->storeImage ($imageDir, $request->file('image'));
        }

        
        // Create the product
        $product = Product::create([
            'name' => ucwords($validated['name']),
            'cost_price' => $hasVariants ? null : $validated['cost_price'],
            'base_price' => $hasVariants ? null : $validated['base_price'],
            'promo_price' => $hasVariants ? null : $validated['promo_price'],
            'promo_start' => $validated['promo_start'],
            'promo_end' => $validated['promo_end'],
            'slug' => $slug,
            'visibility' => $validated['visibility'],
            'description' => $validated['description'],
            'quantity' => $hasVariants ? null : $validated['quantity'],
            'image' => $imagePath,
            'sku' => $sku,
            'category_id' => $validated['category_id'],
            'brand_id' => $validated['brand_id'],
        ]);


        if ($hasVariants) {

            foreach ($validated['variants'] as $variant) {

                $variantImagePath = null;
                
                if (isset($variant['variant_image']) && $variant['variant_image']) {
                    $variantImagePath = $this->storeImage ($imageDir . '/variants', $variant['variant_image']);
                }

                $product->variants()->create([
                    'variant_image' => $variantImagePath,
                    'variant_name' => $variant['variant_name'],
                    'variant_quantity' => $variant['variant_quantity'],
                    'variant_base_price' => $variant['variant_base_price'],
                    'variant_cost_price' => $variant['variant_cost_price'],
                    'variant_promo_price' => $variant['variant_promo_price'],
                    'product_id' => $product->id,
                ]);
            }
        }

        if (isset($validated['tags'])) {
           $this->syncTags ($product, $validated['tags']);
        }

        // Redirect back or return success response
        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }


    public function edit(Product $product)
    {

        $product->load(['brand', 'category', 'tags', 'variants']);

        return inertia('Auth/Admin/Products/ProductEdit', ['product' => $product ]);
    }

    public function update(Request $request, Product $product)
    {
        //return $request;

        $hasVariants = $request->filled('variants');

        $result  = $this->validateProductData($request, $product->id);

        if (!$result['success']) {
            // If validation fails, you can handle errors here as needed
            return redirect()->back()->withErrors($result['errors'])->withInput();
        }

        $validated = $result['data'];

        //generate product slug
        $slug = Str::slug($request->name);

        //generate product sku
        $sku = $product->sku;

        //initialize product image path
        $imagePath = $product->image;

        // Create a directory for the product images if it doesn't exist
        $imageDir = 'products/prod_' . $sku;

        // Generate a unique name with a timestamp
        $timestamp = Carbon::now()->timestamp;

        if ($request->hasFile('image')) {

            if ($product->image) {
                Storage::disk('public')->delete($product->image); // Delete old image from public storage
            }

            $imagePath = $this->storeImage ($imageDir, $request->file('image'));

        }

        //$productQuantity = !$hasVariants ? $validated['quantity'] : null;

        //Update the product
        $product->update([
            'name' => ucwords($validated['name']),
            'cost_price' => $hasVariants ? null : $validated['cost_price'],
            'base_price' => $hasVariants ? null : $validated['base_price'],
            'promo_price' => $hasVariants ? null : $validated['promo_price'],
            'promo_start' => $validated['promo_start'],
            'promo_end' => $validated['promo_end'],
            'slug' => $slug,
            'visibility' => $validated['visibility'],
            'description' => $validated['description'],
            'quantity' => $validated['quantity'],
            'image' => $imagePath,
            'sku' => $sku,
            'category_id' => $validated['category_id'],
            'brand_id' => $validated['brand_id'],
        ]);


        if ( $hasVariants ) {

            $existingVariantIds = $product->variants->pluck('id')->toArray();
        
            $submittedVariantIds = collect($request->variants)->pluck('id')->filter()->toArray(); // Variants submitted that already exist

            $variantsToDelete = array_diff($existingVariantIds, $submittedVariantIds);

            ProductVariant::destroy($variantsToDelete); // Delete them
        
            foreach ($validated['variants'] as $variantData) {

                $variant = ProductVariant::find($variantData['id']);

                if ($variant) {

                    $variantImagePath = $variant->variant_image;

                    if (isset($variantData['variant_image']) && $variantData['variant_image']) {
                        
                        if ($variant->variant_image) {
                            Storage::disk('public')->delete($variant->variant_image); // Delete old image from public storage
                        }
                        //..
                        $variantImagePath = $this->storeImage ($imageDir.'/variants', $variantData['variant_image']);
                    }   

                    $variant->update([
                        'variant_image' => $variantImagePath,
                        'variant_name' => $variantData['variant_name'],
                        'variant_quantity' => $variantData['variant_quantity'],
                        'variant_base_price' => $variantData['variant_base_price'],
                        'variant_cost_price' => $variantData['variant_cost_price'],
                        'variant_promo_price' => $variantData['variant_promo_price'],
                    ]);

                }else {


                    if (isset($variantData['variant_image']) && $variantData['variant_image']) {
                        //..
                        $variantImagePath = $this->storeImage ($imageDir.'/variants', $variantData['variant_image']);
                    }   

                    // Create new variant
                    $product->variants()->create([
                        'variant_image' => $variantImagePath,
                        'variant_name' => $variantData['variant_name'],
                        'variant_quantity' => $variantData['variant_quantity'],
                        'variant_base_price' => $variantData['variant_base_price'],
                        'variant_cost_price' => $variantData['variant_cost_price'],
                        'variant_promo_price' => $variantData['variant_promo_price'],
                        'product_id' => $product->id,
                    ]);

                }
                

                
            }
        }
       

        if (isset($validated['tags'])) {
            $this->syncTags ($product, $validated['tags']);
         }

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }

    protected function syncTags ( $product, $tags) {

        $tagIds = [];

        foreach ($tags as $tagName) {
            // Check if the tag exists in the database
            $tag = Tag::firstOrCreate(['name' => $tagName]);
            // Collect the tag IDs
            $tagIds[] = $tag->id;
        }

        // Sync the tags with the product
        $product->tags()->sync($tagIds);
        
    }

    protected function storeImage ( $dir, $image ) 
    {
        //..
        $variantImage = $image;
    
        $variantImageName = Carbon::now()->timestamp . '_' . Str::random(10) . '.' . $variantImage->getClientOriginalExtension();

        $variantImagePath = $variantImage->storeAs( $dir , $variantImageName, 'public');

        return $variantImagePath;
    }

    protected function validateProductData ($request, $id = null ) {

        $rules = [
            'name' => [
                'required', 
                'string', 
                'min:5', 
                'max:255', 
                $id ? 'unique:products,name,'. $id : 'unique:products,name'
            ],
            'description' => 'nullable|string',
            //'quantity' => 'nullable|numeric|min:1',
            // 'cost_price' => 'sometimes|nullable|numeric|min:1',
            // 'base_price' => 'sometimes|nullable|numeric|min:1|gt:cost_price',
            'quantity' => [
                'nullable',
                'numeric',
                'min:1',
                Rule::requiredIf(!$request->filled('variants'))
            ],
            'cost_price' => [
                'nullable',
                'numeric',
                'min:1',
                Rule::requiredIf(!$request->filled('variants'))
            ],
            'base_price' => [
                'nullable',
                'numeric',
                'min:1',
                Rule::requiredIf(!$request->filled('variants'))
            ],
            'promo_price' => 'nullable|numeric|required_with:promo_start,promo_end|min:1|gt:cost_price|lte:base_price',
            'promo_start' => 'nullable|date|required_with:promo_price,promo_end|after_or_equal:now',
            'promo_end' => 'nullable|date|required_with:promo_price,promo_start|after:promo_start',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:50',
            'visibility' => 'required',
            'variants' => 'nullable|array',
            'variants.*.id' => 'required',
            'variants.*.variant_name' => [
                'required',
                'string',
                'max:255',
                'min:4',
                // Custom validation rule for unique variant names
                function ($attribute, $value, $fail) use ($request) {
                    $variantNames = array_column($request->variants, 'variant_name');
                    if (count(array_unique($variantNames)) < count($variantNames)) {
                        $fail('The variant names must be unique for each product.');
                    }
                },
            ],
            'variants.*.variant_image' => 'nullable|image|mimes:jpeg,png,jpg|max:50',
            'variants.*.variant_quantity' => 'required|integer|min:1',
            'variants.*.variant_cost_price' => 'required|numeric|min:0.01',
            'variants.*.variant_base_price' => 'required|numeric|min:0.01|gt:variants.*.variant_cost_price', // Must be greater than variant_cost_price
            'variants.*.variant_promo_price' => 'nullable|numeric|min:0.01|gt:variants.*.variant_cost_price|lte:variants.*.variant_base_price', // Must be greater than
            'tags' => 'array', // Ensure it's an array
            'tags.*' => 'required|string|max:255|distinct' // Ensure tags are unique within the product
        ];

        // if (!$request->filled('variants')) {
        //     $validationRules['cost_price'] = 'required|numeric|min:1';
        //     $validationRules['base_price'] = 'required|numeric|min:1|gt:cost_price';
        //     $validationRules['quantity'] = 'required|numeric|min:1';
        // }

        $messages = [
            'name.required' => 'The product name is required.',
            'name.min' => 'The product name may be at least 5 characters.',
            'name.unique' => 'The product name must be unique.',

            'cost_price.required' => 'The cost price is required if product has no variants.',
            'cost_price.numeric' => 'The cost price must be a number.',
            'cost_price.min' => 'The cost price must be greater than 1.',
            
            'base_price.required' => 'The base price is required if product has no variants.',
            'base_price.numeric' => 'The base price must be a number.',
            'base_price.min' => 'The base price must be greater than 1.',
            'base_price.gt' => 'The base price must be greater than the cost price.',

            'promo_price.numeric' => 'The promo price must be a number.',
            'promo_price.min' => 'The promo price must be greater than 1.',
            'promo_price.gt' => 'The promo price must be greater than the cost price.',
            'promo_price.lte' => 'The promo price must be less than or equal the base price.',
            'promo_price.required_with' => 'The promo price is required when any of the promo fields is filled.',

            'promo_start.date' => 'The promo start date must be a valid date.',
            'promo_start.after_or_equal' => 'The promo start date must be a date after or equal to now.',
            'promo_start.required_with' => 'The promo start is required when any of the promo fields is filled.',

            'promo_end.date' => 'The promo end date must be a valid date.',
            'promo_end.after' => 'The promo end date must be after the promo start date.',
            'promo_end.required_with' => 'The promo end is required when any of the promo fields is filled.',

            'visibility.required' => 'The visibility status is required.',
            'quantity.integer' => 'The quantity must be an integer.',
            'quantity.min' => 'The quantity must be at least 0.',
            'image.image' => 'The product image must be an image (jpg, jpeg, png).',
            'image.mimes' => 'The product image must be a file of type: jpg, jpeg, png.',
            'image.max' => 'The product image must not be greater than 50KB.',
            'category_id.required' => 'The category is required.',
            'category_id.exists' => 'The selected category is invalid.',
            'brand_id.required' => 'The brand is required.',
            'brand_id.exists' => 'The selected brand is invalid.',
            // 'variants.required' => 'At least one variant is required.',
            'variants.array' => 'Variants must be an array.',
            'variants.*.variant_image.image' => 'The variant image must be an image (jpg, jpeg, png).',
            'variants.*.variant_image.mimes' => 'The variant image must be a file of type: jpg, jpeg, png.',
            'variants.*.variant_image.max' => 'The variant image must not be greater than 50KB.',
            'variants.*.variant_name.required' => 'The variant name is required.',
            'variants.*.variant_name.min' => 'The variant name may be at least 4 characters.',
            'variants.*.variant_name.max' => 'The variant name may not be greater than 255 characters.',
            'variants.*.variant_quantity.required' => 'The variant quantity is required.',
            'variants.*.variant_quantity.integer' => 'The variant quantity must be an integer.',
            'variants.*.variant_quantity.min' => 'The variant quantity must be at least 0.',
            'variants.*.variant_base_price.required' => 'The variant base price is required.',
            'variants.*.variant_base_price.numeric' => 'The variant base price must be a number.',
            'variants.*.variant_base_price.min' => 'The variant base price must be greater than 1.',
            'variants.*.variant_base_price.gt' => 'The variant base price must be greater than the variant cost price.',
            'variants.*.variant_cost_price.required' => 'The variant cost price is required.',
            'variants.*.variant_cost_price.numeric' => 'The variant cost price must be a number.',
            'variants.*.variant_cost_price.min' => 'The variant cost price must be greater than 0.',
            'variants.*.variant_promo_price.numeric' => 'The variant promo price must be a number.',
            'variants.*.variant_promo_price.min' => 'The variant promo price must be greater than 0.',
            'variants.*.variant_promo_price.gt' => 'The variant promo price must be greater than the variant cost price.',
            'variants.*.variant_promo_price.lte' => 'The variant promo price must be less than or equal the variant base price.',
            'tags.required' => 'At least one tag is required.',
            'tags.array' => 'Tags must be an array.',
            'tags.*.required' => 'Each tag is required.',
            'tags.*.string' => 'Tags must be strings.',
            'tags.*.max' => 'Each tag may not be greater than 255 characters.',
            'tags.*.distinct' => 'Tags must be unique.',
            'tags.*.unique' => 'The tag ":input" has already been used for this product.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->errors(),
                'data' => null, // No validated data on failure
            ];
        }

        return [
            'success' => true,
            'errors' => null, // No errors on success
            'data' => $validator->validated(),
        ];

    } 

}
