// ProductListing.jsx
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PaginationLinks from '@/Components/PaginationLinks';
import PriceRange from '@/Components/PriceRange';
import MainLayout from '@/Layouts/MainLayout';

const ProductListing = ({ auth, productListing, categories, brands }) => {

    const [products, setProducts] = useState( productListing.data || []);
    const [filters, setFilters] = useState({ 
        category: '',
        brand: '', 
        priceRange: [0, 100], 
        promo: false 
    });
    const [sortOrder, setSortOrder] = useState('price-asc');
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [filters, sortOrder, searchTerm]);

    const fetchProducts = async () => {
        // Fetch products based on filters, sort order, and search term
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleViewChange = (view) => {
        setViewMode(view);
    };


    return (

        <MainLayout>
       
            <Head title="Welcome" />
 
            <div className="lg:flex max-w-7xl mx-auto">

                <div className="hidden lg:block w-full lg:min-w-[18rem] lg:w-[18rem] overflow-auto px-3 py-7">
                    <h1 className="font-semibold mb-2">Filter Search</h1>
                    <div>
                        <input type="text" name="search" className="focus:outline-none focus:ring-0 focus:border-gray-500 w-full border border-gray-400 rounded bg-white py-1.5 text-sm shadow-inner" placeholder="search product here"/>
                    </div>
                    <div className="my-3">
                        <p className="font-semibold text-sm mb-2">Category</p>
                        
                        {categories.map((category, index) => (
                            <div key={index}>
                                <input 
                                    type="checkbox" 
                                    name="categories"
                                    id={`cat_${index}`}
                                    value={category.id}
                                    onChange={handleFilterChange}
                                    className="mr-2"
                                />
                                <label htmlFor={`cat_${index}`} className="text-xs">{category.name}</label>
                            </div>
                            
                        ))}
                    </div>
                    <div className="my-3">
                        <p className="font-semibold text-sm mb-2">Brands</p>
                        {brands.map((brand, index) => (
                            <div key={index}>
                                <input 
                                    type="checkbox" 
                                    name="brands"
                                    id={`brand_${index}`}
                                    value={brand.id}
                                    onChange={handleFilterChange}
                                    className="mr-2"
                                />
                                <label htmlFor={`brand_${index}`} className="text-xs">{brand.name}</label>
                            </div>
                            
                        ))}
                    </div>
                    <div className="my-3">
                        <p className="font-semibold text-sm mb-3">Price Range</p>   
                        <div className="flex gap-2">
                            <input type="text" name="price_min" placeholder="min" className="w-1/2 xl:w-1/3 text-xs rounded" />
                            <input type="text" name="price_max" placeholder="max" className="w-1/2 xl:w-1/3 text-xs rounded" />
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 grow">

                    <div className="sm:flex sm:justify-center lg:justify-end gap-x-4 mb-4 mt-2">
                        
                        <div className="flex items-center gap-x-1 mb-2 md:mb-0 md:mr-2 text-xs">
                            <span className="w-20 sm:w-auto">Sort By </span>
                            <select onChange={handleSortChange} className="px-2 py-1 border rounded w-44 text-xs">
                                <option value="best-match">Best Match</option>
                                <option value="price-asc">Price Low to High</option>
                                <option value="price-desc">Price High to Low</option>
                            </select>
                        </div>
                       
                        <div className="flex items-center mb-2 md:mb-0 gap-x-1 text-xs">
                            <span className="w-20 sm:w-auto">View Mode </span>
                           
                            <button onClick={() => handleViewChange('grid')} className={`px-2 py-1 border rounded border-gray-500 ${viewMode ==='grid' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}`} disabled={viewMode==='grid'}>Grid View</button>
                            
                            
                            <button onClick={() => handleViewChange('list')} className={`px-2 py-1 border rounded border-gray-500 ${viewMode ==='list' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}`} disabled={viewMode==='list'}>List View</button>
                        </div>
                    </div>

                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-1 gap-y-3' : 'flex flex-col'}>

                        {products.map((product) => (

                            viewMode === 'grid' ? (
                                <div key={product.id} className="w-[80%] min-h-[280px] mx-auto sm:w-full sm:mx-0 bg-white border border-gray-300 rounded p-3 transition duration-300 ease-in-out hover:shadow-lg hover:cursor-pointer" onClick={() => router.visit(route('product.show', { id: product.id}))}>
                                    <img 
                                        src={ product.image ? '/storage/' + product.image : '/assets/noimage.png'} 
                                        alt={product.name} 
                                        className="w-full h-40 object-contain mb-3 border border-gray-300 bg-gray-100"  
                                    /> 
                                    <h3 className="text-sm font-medium">{product.name}</h3>
                                    
                                    { product.variants && product.variants.length > 0 ? (
                                        <PriceRange variants={product.variants} className="text-orange-600 py-1" />

                                    ): (
                                        <span className="text-orange-600 py-1">₱{product.base_price}</span>
                                    )}

                                   
                                    
                                </div>
                            ) : (
                                <div key={product.id} className="bg-white border border-gray-200 p-3 transition duration-300 ease-in-out hover:shadow-lg hover:cursor-pointer mb-2" onClick={() => router.visit(route('product.show', { id: product.id}))}>
                                    
                                    <div className="flex">
                                        <img 
                                            src={ product.image ? '/storage/' + product.image : '/assets/noimage.png'} 
                                            alt={product.name} 
                                            className="w-20 min-w-20 lg:w-32 lg:min-w-32 h-20 object-contain border border-gray-400 bg-gray-100"  
                                        /> 
                                        <div className="grow ml-4">
                                            <h3 className="font-medium">{product.name}</h3>

                                            { product.variants && product.variants.length > 0 ? (
                                                <PriceRange variants={product.variants} className="text-orange-600 py-1" />

                                            ): (
                                                <span className="text-orange-600 py-1">₱{product.base_price}</span>
                                            )}
                                            
                                            {/* <div className="flex gap-1 mt-2">
                                                <Link href={route('product.show', { id: product.id})} className="px-3 py-0.5 bg-sky-600 text-white text-sm text-center rounded">View Details</Link>
                                                
                                                <button className="px-3 py-0.5 bg-teal-500 text-sm text-white rounded">Add to Cart</button>
                                            </div> */}

                                        </div>
                                    </div>
                                    
                                </div>
                            )
                        ))}

                    </div>

                    <PaginationLinks className="my-6" color="sky" links={productListing.links} />

                </div>
            </div>

        </MainLayout>
    );
};

export default ProductListing;
