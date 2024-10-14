import React from 'react';

export default function VariantsPriceRange ({ variants, className = '' }) {

    const prices = variants.map(
        variant => variant.variant_is_promo ? variant.variant_discounted_price : variant.variant_base_price
    );

    // Find the minimum and maximum prices
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (
        <div>
            {minPrice === maxPrice ? (
                // If all prices are the same, display the single price
                <span className={`text-orange-400 ` + className}>₱{minPrice}</span>
            ) : (
                // If prices vary, display the price range
                <span className={`text-orange-400 ` + className}>
                    ₱{minPrice} - ₱{maxPrice}
                </span>
            )}
        </div>
    );
}