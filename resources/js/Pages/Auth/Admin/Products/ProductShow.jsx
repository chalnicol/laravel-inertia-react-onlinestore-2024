import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import dayjs from 'dayjs';

export default function ProductShow ({ product })  {

    const formatDate = ( dateStr ) => {

        return dayjs(dateStr).format('MMM DD, YYYY hh:mm A');
    }


    
    return (
        <AuthenticatedLayout 
                header={
                    <>
                        <div className="text-sm mb-0.5">
                            <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo; <Link href={'/admin/products'} className="text-orange-600">Products</Link> &raquo;
                        </div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            View Product
                        </h2>
                    </>
                
                }
            >
                <Head title="Products" />

                <div className="max-full max-w-7xl px-4 lg:px-6 mx-auto mb-12">

                    <div className="md:flex mt-6">

                        <div className="w-full flex justify-center md:block md:w-auto">
                            { product.image ? (
                                <img src={`/storage/${product.image}`} alt={product.name} className="w-32 h-32 border border-gray-500 object-cover rounded" />
                            ) : (
                                <img src={`/assets/noimage.png`} alt={product.name} className="w-32 h-32 border border-gray-500 object-cover rounded" />
                            )}
                        </div>

                        <div className="grow">
                            <div className="p-3">
                                <h2 className="text-xl lg:text-2xl font-semibold mb-1"> { product.name}</h2>
                                <p className="text-gray-700 text-sm">{product.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm mt-4 lg:grid grid-rows-7 grid-cols-2 grid-flow-col gap-x-6" >


                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">ID</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.id}</p>
                            </div>
                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">SKU</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.sku}</p>
                            </div>
                            
                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Brand</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">
                                    {product.brand.name}
                                </p>
                            </div>

                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Category</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">
                                    {product.category.name}
                                </p>
                            </div>
                           
                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Quantity</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">
                                    { product.variants ? '--' : product.quantity }
                                </p>
                            </div>
                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Visibility</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.visibility}</p>
                            </div>
                            
                            
                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Tags</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">
                                    {product.tags && product.tags.length > 0 ? (
                                        product.tags.map(tag => (
                                            <span key={tag.id} className="inline-block bg-gray-600 text-white text-xs px-2 py-0.5 mr-1 rounded">
                                                {tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs">---</span>
                                    )}
                                </p>
                            </div>

                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Cost Price</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.cost_price ? `₱${product.cost_price}` : '--'}</p>
                            </div>
                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Base Price</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.base_price ? `₱${product.base_price}` : '--'}</p>
                            </div>
                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Promo Price</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.promo_price ? `₱${product.promo_price}` : '--'}</p>
                            </div>
                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Promo Start</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.promo_start ? formatDate(product.promo_start) : '--'}</p>
                            </div>
                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Promo End</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.promo_end ? formatDate(product.promo_end) : '--'}</p>
                            </div>

                          
                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Created At</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{ formatDate(product.created_at )}</p>
                            </div>
                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Updated At</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{formatDate(product.updated_at)}</p>
                            </div>


                    </div>


                    {/* variants */}

                  

                    { product.variants && product.variants.length > 0 ? (

                        <>
                            <h2 className="text-lg text-gray-100 font-medium mt-6 mb-4 bg-gray-700 px-3 py-1">Variants</h2>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                                { product.variants.map (variant => (
                                    <div key={variant.id} className="text-sm border border-gray-400 p-3 rounded overflow-hidden" >
                                    
                                        <div className="flex gap-2 mb-3">
                                            <div>
                                                { variant.variant_image ? (
                                                    <img src={`/storage/${variant.variant_image}`} alt={variant.variant_name} className="w-16 h-16 border border-gray-300 object-cover rounded" />
                                                ) : (
                                                    <img src={`/assets/noimage.png`} alt={variant.variant_name} className="w-16 h-16 border border-gray-300 object-cover rounded" />

                                                )}
                                            </div>
                                            <div className="text-xl font-medium">
                                                {variant.variant_name}
                                            </div>
                                        </div>
                                        
                                        <div className="md:flex mb-1">
                                            <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Quantity</p>
                                            <p className="bg-gray-200 ml-2 p-2 grow">{variant.variant_quantity}</p>
                                        </div>
                                        <div className="md:flex mb-1">
                                            <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Cost Price</p>
                                            <p className="bg-gray-200 ml-2 p-2 grow">{variant.variant_cost_price}</p>
                                        </div>
                                        <div className="md:flex mb-1">
                                            <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Base Price</p>
                                            <p className="bg-gray-200 ml-2 p-2 grow">{variant.variant_base_price}</p>
                                        </div>
                                        <div className="md:flex mb-1">
                                            <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Promo Price</p>
                                            <p className="bg-gray-200 ml-2 p-2 grow">{variant?.variant_promo_price ?? '--'}</p>
                                        </div>
                                        
                                    </div>
                                ))}

                            </div>
                        </>
                       
                        
                        
                    ) : (
                        <>
                            <hr className="border border-gray-300 mt-6 mb-2" />

                            <div className="text-sm text-gray-500">&bull; This product has no variants.</div>
                        </>
                    )}

                </div>

                <br />
                

        </AuthenticatedLayout>
    )

}