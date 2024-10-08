import React, {useState, useEffect} from 'react';
import FileInput from '@/Components/FileInput';


export default function VariantInput ({ variant, errors = {}, onValueChange, onRemove }) {

    const [variantData, setVariantData] = useState({
        id: variant.id,
        variant_image: null,
        variant_name: variant.variant_name || '',
        variant_quantity: variant.variant_quantity || '',
        variant_cost_price: variant.variant_cost_price || '',
        variant_promo_price: variant.variant_promo_price || '',
        variant_base_price: variant.variant_base_price || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVariantData({ ...variantData, [name] : value });
    };

    const handleFileInputChange = (files) => {
        setVariantData({ ...variantData, ['variant_image'] : files ? files[0] : null });
    }

    useEffect ( () => {
        onValueChange(variantData, variantData.id);
    }, [variantData]);

  
    return (
        

        <div className="rounded overflow-hidden border border-gray-400 bg-white">
            <div className="flex justify-between items-center px-3 py-2 bg-gray-200 text-gray-500">
                <h3 className="text-sm font-medium">Product Variant</h3>
                <button type="button" className="text-xs font-medium  hover:text-gray-400" onClick={() => onRemove(variant.id)}>Remove</button>
            </div>
            
            

            <div className="px-3 py-2">

                <div className="mb-2">
                    <FileInput className={`${errors.variant_image ? 'border-red-500' : 'border-gray-500' }`} label="upload image here" onFileInputChange={handleFileInputChange} />
                    {errors.variant_image && <p className="text-red-500 text-xs mt-1">{errors.variant_image}</p>}
                </div>

                <div className="mb-2">
                    <input 
                        type="text" 
                        name="variant_name"
                        value={variantData.variant_name}
                        className={`border rounded w-full py-2 px-3 text-sm ${ errors.variant_name ? 'border-red-500' : 'border-gray-500'}`}
                        placeholder="input name here"
                        onChange={handleInputChange}
                    />
                     {errors.variant_name && <p className="text-red-500 text-xs mt-1">{errors.variant_name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-x-2">

                    <div className="mb-2">
                        <input 
                            type="text" 
                            name="variant_quantity" 
                            value={variantData.variant_quantity}
                            className={`border rounded w-full py-2 px-3 text-sm ${ errors.variant_quantity ? 'border-red-500' : 'border-gray-500'}`}
                            placeholder="input quantity here"
                            onChange={handleInputChange}
                        />
                        {errors?.variant_quantity && <p className="text-red-500 text-xs mt-1">{errors.variant_quantity}</p>}
                    </div>
                    
                    <div className="mb-2">
                        <input 
                            type="text" 
                            name="variant_cost_price" 
                            value={variantData.variant_cost_price}
                            className={`border rounded w-full py-2 px-3 text-sm ${ errors?.variant_cost_price ? 'border-red-500' : 'border-gray-500'}`}
                            placeholder="input cost price  here"
                            onChange={handleInputChange}
                        />
                        {errors.variant_cost_price && <p className="text-red-500 text-xs mt-1">{errors.variant_cost_price}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2">
                    <div className="mb-2">
                        <input 
                            type="text" 
                            name="variant_base_price" 
                            value={variantData.variant_base_price}
                            className={`border rounded w-full py-2 px-3 text-sm ${ errors.variant_base_price ? 'border-red-500' : 'border-gray-500'}`}
                            placeholder="input base price  here"
                            onChange={handleInputChange}
                        />
                        {errors.variant_base_price && <p className="text-red-500 text-xs mt-1">{errors.variant_base_price}</p>}
                    </div>

                    <div className="mb-2">
                        <input 
                            type="text" 
                            name="variant_promo_price" 
                            value={variantData.variant_promo_price}
                            
                            className={`border rounded w-full py-2 px-3 text-sm ${ errors.variant_promo_price ? 'border-red-500' : 'border-gray-500'}`}
                            placeholder="input promo price here"
                            onChange={handleInputChange}
                        />
                        {errors.variant_promo_price && <p className="text-red-500 text-xs mt-1">{errors.variant_promo_price}</p>}
                    </div>
                </div>
                
            </div>
        </div>
    );
}