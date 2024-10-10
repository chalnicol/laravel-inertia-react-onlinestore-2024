// ProductDetail.jsx
import React, {useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import PriceRange from '@/Components/PriceRange';
import MainLayout from '@/Layouts/MainLayout';
import dayjs from 'dayjs';

const ProductDetail = ({ product }) => {

    const getDiscountedPrice = ( price ) => { 
        
        const currentDate = new Date();
        
        const discountStart = new Date(product.promo_start);
        const discountEnd = new Date(product.promo_end);

        console.log (discountStart, discountEnd);

        if (currentDate >= discountStart && currentDate <= discountEnd) {

            

            const discounted = price - (price * product.promo_discount / 100);

            return discounted.toFixed(2);
        }

        return price;
    }

    const formatDate = ( dateStr ) => {
        return dayjs(dateStr).format('MMM DD, YYYY hh:mm A');
    }

    const [ order, setOrder ] = useState({
        quantity: 1,
        promo : false,
        purchase_price : product.variants.length > 0 ? getDiscountedPrice(product.variants[0].variant_base_price) : getDiscountedPrice(product.base_price),
        variant: product.variants.length ? product.variants[0] : null,
    });

    const handleAddToCart = () => {
        // Implement add to cart logic
    };
    const handleCheckout = () => {
        // Implement add to cart logic
    };
    const handleQuantityChange = (mode) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            quantity: mode === 'add' ? prevOrder.quantity + 1 : Math.max(prevOrder.quantity - 1, 1)
        }));
    };
    const handleQuantityInputChange = (e) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            quantity: Math.max(e.target.value, 1)
        }));
    };
    const handleVariantSelect = (variant) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            variant: variant,
            purchase_price: getDiscountedPrice(variant.variant_base_price),
        }));
    }   

    const isInPromo = useMemo (() => {

        if (!product.promo_start || !product.promo_end) return false;

        const currentDate = new Date();
        const discountStart = new Date(product.promo_start);
        const discountEnd = new Date(product.promo_end);

        return currentDate >= discountStart && currentDate <= discountEnd;

    }, [product])
    
  

    return (

      
        <MainLayout>
       
            <Head title="Product Detail" />

                <div className="w-full max-w-7xl mx-auto py-6 lg:flex">

                    <div className="grow md:flex gap-6 px-4 mb-6 lg:mb-0">
                       
                        <img 
                            src={product.image ? '/storage/' + product.image : '/assets/noimage.png'} 
                            alt={product.name} 
                            className="w-full md:w-[210px] md:min-w-[210px] max-h-[210px] object-contain border border-gray-400 bg-gray-100 mx-auto"  
                        /> 

                        <div className="grow flex flex-col mt-4 md:mt-0">
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                                <p className="text-sm text-gray-600 mb-2 leading-normal">{product.description}</p>

                                <p className="text-3xl font-medium text-orange-500 mb-1">
                                    {/* { product.variants && product.variants.length > 0 ? (
                                        <span>{ order.variant.variant_base_price }</span>
                                    ) : (
                                        <span>{  }</span>
                                    )} */}
                                    ₱{ order.purchase_price }
                                </p>
                                
                                { isInPromo && (
                                    <div className="font-medium text-sm">
                                        <span className="line-through text-gray-500">
                                            { product.variants && product.variants.length > 0 ? (
                                                <span>₱{ order.variant.variant_base_price }</span>
                                            ) : (
                                                <span>₱{ product.base_price }</span>
                                            )}
                                        </span>
                                        <span className="ml-2 text-500-600">-{product.promo_discount}%</span>
                                    </div>
                                )}
                                
                            </div>

                            <div className="text-sm mb-2 text-gray-600 flex items-center gap-3">
                                <span className="font-medium text-gray-700 w-24 px-2 py-1">Promo</span>
                                <span className="py-1">
                                   { formatDate ( product.promo_start) + " - " + formatDate ( product.promo_end )}
                                </span>
                            </div>

                            {/* brand.. */}
                            <div className="text-sm mb-2 text-gray-600 flex items-center gap-3">
                                <span className="font-medium text-gray-700 w-24 px-2 py-1">Brands</span>
                                <span className="py-1">
                                    { product.brand ? product.brand.name : ''}
                                </span>
                            </div>

                            {/* variants */}
                            {product.variants && product.variants.length > 0 && (

                                <div className="text-sm mb-2 text-gray-600 flex items-start gap-3">
                                    <span className="font-medium text-gray-700 w-24 px-2 py-1">Variant</span>
                                    <div>
                                        <div className="py-1">{ order.variant ? order.variant.variant_name : ''}</div>

                                        <div className="grid grid-cols-5 gap-x-2 gap-y-1 mt-2">
                                           
                                                { product.variants.map ( (variant) => (

                                                    <img 
                                                        key={variant.id}
                                                        id={variant.id}
                                                        className={`w-12 h-10 cursor-pointer object-contain mb-1 border transition duration-300 ease-out ${order.variant.id === variant.id ? 'border-orange-600 shadow-md' : 'border-gray-500'}`} 
                                                        src={variant.image? `/storage/${variant.image}` : '/assets/noimage.png'}
                                                        alt={variant.name}
                                                        onClick={() => handleVariantSelect(variant)}
                                                    />
                                                    
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* quantity */}
                            <div className="text-sm mb-2 text-gray-600 flex items-center gap-3">
                                <span className="font-medium text-gray-700 w-24 px-2 py-1">Quantity</span>
                                <div className="flex items-center">

                                    <button className="w-10 h-8 bg-gray-300 rounded-l" onClick={() => handleQuantityChange('subtract') }>-</button>

                                    <input 
                                        type="text" 
                                        id="quantity" 
                                        name="quantity" 
                                        value={order.quantity} 
                                        className="border border-gray-300 w-20 h-8" 
                                        onChange={handleQuantityInputChange}
                                    />
                                    
                                    <button className="w-10 h-8 bg-gray-300 rounded-r"  onClick={() => handleQuantityChange('add') }>+</button>

                                </div>
                            </div>

                            <div className="flex gap-3 w-full my-5">
                                <button className="px-4 py-2 bg-yellow-500 w-1/2 xl:w-1/3 rounded text-white" onClick={handleAddToCart}>Add to Cart</button>
                                <button className="px-4 py-2 bg-orange-500 w-1/2 xl:w-1/3 rounded text-white" onClick={handleCheckout}>Checkout</button>
                            </div>

                        </div>
                        
                    </div>
                    <div className="px-4 w-full lg:w-[320px] lg:min-w-[320px]">
                        
                        <h6 className="font-semibold text-sm mb-3 text-gray-600">Delivery Options</h6>
                        <div className="mb-2 leading-normal text-sm flex gap-2">
                            <span className="material-symbols-outlined">
                            location_on
                            </span>
                            
                            <p>Sacred Heart Village, QC</p>
                        </div>


                        <hr className="border-gray-300 my-3"/>

                        <div className="mb-2 leading-normal text-sm flex gap-2">
                            <span className="material-symbols-outlined">
                            local_shipping
                            </span>
                            <div> 
                                <h6 className="font-semibold text-sm mb-1">Priority Delivery (1-2 Hours)</h6>
                                <p className="text-justify leading-normal">
                                Guaranteed delivery within 1-2 hours for orders placed before 7:00 PM within a 2km radius. Orders placed after 7:00 PM will be delivered the next day, starting at 8:00 AM. If the delivery is late, you will receive a ₱10 voucher
                                </p>
                            </div>
                        </div>


                        <hr className="border-gray-300 my-3"/>

                        <div className="mb-2 leading-normal text-sm flex gap-2">
                            <span className="material-symbols-outlined">
                            credit_card
                            </span>
                            <p>
                            <span className="font-semibold">Cash on Delivery</span> is available for orders below ₱200.

                            </p>
                        </div>

                        <hr className="border-gray-300 my-3"/>

                        <h6 className="font-semibold text-sm mb-3 text-gray-600">Return and Warranty</h6>

                        <div className="text-sm flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                check
                                </span>
                                <span>100% Authentic</span>
                                
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                psychology_alt
                                </span>
                                <span>Change of mind returns</span>
                                
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                package
                                </span>
                                <span>2 Days Free Returns</span>
                                
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                shield_question
                                </span>
                                <span>Warranty not available</span>
                                
                            </div>
                            
                            
                        </div>
                    </div>
                    
                </div>
        </MainLayout>
        

    );
};

export default ProductDetail;
