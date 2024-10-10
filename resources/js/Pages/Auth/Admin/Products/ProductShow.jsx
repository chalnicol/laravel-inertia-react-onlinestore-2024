import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

import dayjs from 'dayjs';

export default function ProductShow ({ product })  {

    const [ showModal, setShowModal ] = useState(false);

    const formatDate = ( dateStr ) => {
        return dayjs(dateStr).format('MMM DD, YYYY hh:mm A');
    }

    const handleDeleteConfirmation = ( confirmed ) => {
        if (confirmed) {
            router.delete(`/admin/products/${product.id}`, {
                onSuccess: () => setShowModal(false),
            });
        }   else {
            setShowModal(false);
        }
    };

    
    return (
        <MainLayout 
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

                    <div className="grid grid-cols-2 gap-2 md:flex justify-end mt-4 mb-4 md:mb-2">
                        <Link className="bg-cyan-500 py-2 px-3 text-center text-white rounded text-xs font-medium" href={route('products.edit', {id : product.id} )}>Edit Product</Link>
                        <button
                            className="bg-red-500 py-2 px-3 text-center text-white rounded text-xs font-medium"
                            onClick={() => setShowModal(true)}
                        >
                            Delete Product
                        </button>
                    </div>

                    <div className="md:flex">

                        <div className="w-full flex justify-center md:block md:w-auto">
                            { product.image ? (
                                <img src={`/storage/${product.image}`} alt={product.name} className="w-24 h-24 min-w-24 border border-gray-500 object-cover rounded" />
                            ) : (
                                <img src={`/assets/noimage.png`} alt={product.name} className="w-24 h-24 min-w-24 border border-gray-500 object-cover rounded" />
                            )}
                        </div>

                        <div className="grow">
                            <div className="py-2 md:py-3 md:px-3" >
                                <h2 className="text-xl lg:text-2xl font-semibold mb-1"> { product.name}</h2>
                                <p className="text-gray-700 text-xs md:text-sm">{product.description}</p>
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

                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Cost Price</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.cost_price ? `₱${product.cost_price}` : '--'}</p>
                            </div>

                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Base Price</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.base_price ? `₱${product.base_price}` : '--'}</p>
                            </div>

                            <div className="md:flex  mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Promo Discount</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">{product.promo_discount ? `${product.promo_discount}%` : '--'}</p>
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
                            <div className="md:flex mb-2 md:mb-1">
                                <p className="bg-gray-300 p-2 font-medium w-full md:w-[170px]">Visibility</p>
                                <p className="bg-gray-200 md:ml-2 p-2 grow">
                                    {product.visibility === 'draft' && (
                                        <span className="bg-orange-600 text-white text-xs px-2 py-0.5 mr-1 rounded">Draft</span>
                                    )}
                                    {product.visibility === 'visible' && (
                                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 mr-1 rounded">Visible</span>
                                        
                                    )}
                                    {product.visibility === 'hidden' && (
                                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 mr-1 rounded">Hidden</span>
                                    )}
                                    
                                </p>
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


                    </div>

                    { product.variants && product.variants.length > 0 ? (

                        <>
                        <h2 className="text-lg text-gray-100 font-medium mt-6 mb-4 bg-gray-700 px-3 py-1">Variants</h2>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                            { product.variants.map (variant => (
                                <div key={variant.id} className="text-sm border border-gray-400 p-3 rounded overflow-hidden" >
                                
                                    <div className="flex items-center gap-2 mb-3">
                                        <div>
                                            { variant.variant_image ? (
                                                <img src={`/storage/${variant.variant_image}`} alt={variant.variant_name} className="w-12 h-12 min-w-12 border border-gray-300 object-cover rounded" />
                                            ) : (
                                                <img src={`/assets/noimage.png`} alt={variant.variant_name} className="w-12 h-12 min-w-12 border border-gray-300 object-cover rounded" />

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

                <ConfirmDeleteModal size="md" show={showModal} toDelete={product} onDeleteConfirmation={handleDeleteConfirmation} />
                
                <br />
                

        </MainLayout>
    )

}