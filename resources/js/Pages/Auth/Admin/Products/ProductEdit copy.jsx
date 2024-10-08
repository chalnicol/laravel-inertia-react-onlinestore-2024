import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SelectSearch from '@/Components/SelectSearch';
import TagsInput from '@/Components/TagsInput';

const ProductEdit = ({ product, errors }) => {
    
    const [formData, setFormData] = useState({
        name: product.name || '',
        base_price: product.base_price || '',
        quantity : product.quantity || '',
        description: product.description || '',
        category_id: product.category_id || null,
        brand_id: product.brand_id || null,
        tags: [],
        image : null,
        _method : 'put'
    });

    // Populate the form with product data when the component mounts
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updating product...', formData);
        // Send PUT request to update the product
        router.post(`/admin/products/${product.id}`, formData, {
            forceFormData: true,
            onFinish : () => console.log('Product updated successfully')
        });

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBrandChange = (value) => {
        console.log('Updating brand...', value );
        setFormData((prevData) => ({
            ...prevData,
            brand_id: value,
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            category_id: value,
        }));
    };

    const handleTagsChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            tags: value,
        }));
    };

    const handleImageChange = (e) => {
        // console.log('image changed', e.target.files[0]);
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0], 
        }));
    };


    useEffect ( () => {
        setFormData((prevData) => ({
            ...prevData,
            tags : product.tags.map ( tag => tag.name ),
        }));
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <div className="text-sm mb-0.5">
                        <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo; <Link href={'/admin/products'} className="text-orange-600">Products</Link> &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Product
                    </h2>
                </>
            }
        >
            <Head title="Edit Product" />

            <div className="max-full max-w-7xl p-4 mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="lg:grid grid-cols-2 gap-x-6">
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`border rounded w-full py-2 px-3 ${errors.name ? 'border-red-500' : 'border-gray-500'}`}
                                    placeholder="name"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs py-1">{errors.name}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-500">Product Price</label>
                                <input
                                    type="text"
                                    name="base_price"
                                    value={formData.base_price}
                                    onChange={handleInputChange}
                                    className={`border rounded w-full py-2 px-3 ${errors.price ? 'border-red-500' : 'border-gray-500'}`}
                                    required
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-red-500 text-xs py-1">{errors.price}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-500">Product Quantity</label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className={`border rounded w-full py-2 px-3 ${errors.quantity ? 'border-red-500' : 'border-gray-500'}`}
                                    required
                                    placeholder="0.00"
                                />
                                {errors.quantity && <p className="text-red-500 text-xs py-1">{errors.quantity}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-500">Product Description</label>
                                <textarea
                                    name="description"
                                    onChange={handleInputChange}
                                    value={formData.description}
                                    className="rounded h-24 w-full text-gray-800"
                                    placeholder="Enter description here"
                                />
                                {errors.description && <p className="text-red-500 text-xs py-1">{errors.description}</p>}

                            </div>
                        </div>

                        <div>

                            <div className="mb-4">
                                
                                <label className="block text-gray-500 text-sm">Product Image</label>
                                <input className="block w-full text-sm text-gray-900 border border-gray-500 px-2 py-2 rounded cursor-pointer bg-white  focus:outline-none focus:ring-1 focus:ring-blue-500" type="file" onChange={handleImageChange} accept="image/*" />

                                {errors.image && <p className="text-red-500 text-xs py-1">{errors.image}</p>}

                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-500 text-sm">Product Brand</label>
                                <SelectSearch
                                    label="Select Brand"
                                    resource="brands"
                                    multiSelect={false}
                                    error={errors.brand_id}
                                    onValueChange={handleBrandChange}
                                    value={product.brand}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-500 text-sm">Product Category</label>
                                <SelectSearch
                                    label="Select Category"
                                    resource="categories"
                                    multiSelect={false}
                                    error={errors.category_id}
                                    onValueChange={handleCategoryChange}
                                    value={product.category}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-500 text-sm">Product Tags</label>
                                <TagsInput
                                    label="Product Tags"
                                    onTagsChange={handleTagsChange}
                                    error={errors.tags}
                                    value={product.tags}
                                />
                            </div>
                        </div>
                    </div>


                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        Update Product
                    </button>
                </form>

              
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductEdit;
