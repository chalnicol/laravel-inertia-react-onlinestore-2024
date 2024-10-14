export const getPriceRange = ( variants, isDiscounted = false ) => {

    if (isDiscounted) {

        const selling_prices = variants.map( variant => variant.variant_selling_price);
        return {
            min: Math.min(...selling_prices).toFixed(2),
            max: Math.max(...selling_prices).toFixed(2)
        }

    }else {

        const prices = variants.map( variant => variant.variant_base_price );
        return {
            min: Math.min(...prices).toFixed(2),
            max: Math.max(...prices).toFixed(2)
        }
    }

    return null;
    
}