import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import MainLayout from '@/Layouts/MainLayout';
import FlashMessage from '@/Components/FlashMessage';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import PaginationLinks from '@/Components/PaginationLinks';

const ProductIndex = ({ items, filters, flash }) => {

    // const { brands } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
 
    // State for search input
    const [search, setSearch] = useState(filters.search || '');

    // Function to handle search with debounce
    const handleSearch = debounce((query) => {
        router.get(route('products.index'), { search: query }, { preserveState: true, replace:true });
    }, 500); 

    // Handle onChange and update search state
    const onSearchChange = (e) => {
        setSearch(e.target.value); // Update search state
        handleSearch(e.target.value); // Trigger search with debounce
    };

    const confirmDelete = (item) => {
        setToDelete(item);
        setShowModal(true); 
    }
    const handleDeleteConfirmation = ( confirmed ) => {
        if (confirmed) {
            router.delete(`/admin/products/${toDelete.id}`, {
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
                        <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Products
                    </h2>
                </>
               
            }
        >
            <Head title="Products" />
            
            <div className="max-full max-w-7xl px-4 mx-auto">

                <FlashMessage flash={flash} />

                <div className="md:flex gap-2 w-full mt-3">

                    <div className="grow">
                        <input
                            type="text"
                            placeholder="Filter products..."
                            value={search}
                            onChange={onSearchChange} // Trigger search on input change
                            className="border border-gray-300 px-4 py-2 rounded w-full mb-2"
                        />
                    </div>
                    <Link href={route('products.create')} className="w-full mb-2 md:w-auto bg-sky-900 hover:bg-sky-800 text-white px-3 py-2 rounded-md border text-sm font-medium flex items-center justify-center">
                        + New Product
                    </Link>
                    
                </div>
               
                {(items.data && items.data.length > 0) ? (
                    <>
                    <div className="overflow-x-auto w-full mb-6">
                        <table className="min-w-[600px] w-full text-sm">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Image</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    {/* <th className="px-4 py-2 text-left">Description</th> */}
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Category</th>
                                    <th className="px-4 py-2 text-left">Brand</th>
                                    <th className="px-4 py-2 text-left">Tags</th>
                                    <th className="px-4 py-2 text-left">Variants</th>
                                    <th className="px-4 py-2 text-left">Visibility</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.data.map(item => (
                                    <tr key={item.id} className="odd:bg-gray-100 even:bg-gray-200 border-gray-300">
                                        <td className="px-4 py-2">{item.id}</td>
                                        <td className="px-4 py-2">
                                            {item.image ? (
                                               <img src={`/storage/${item.image}`} alt={item.name} className="h-6 w-6 border border-gray-300 object-cover" />
                                            ) : (
                                               <img src={`/assets/noimage.png`} alt={item.name} className="h-6 w-6 border border-gray-300 object-cover" />

                                            )}
                                        </td>
                                        <td className="px-4 py-2">{item.name}</td>
                                        {/* <td className="px-4 py-2">
                                            {item.description.substring(0, 10)}...
                                        </td> */}
                                        <td className="px-4 py-2">{item.base_price ? `₱${item.base_price}` : '--'}</td>

                                        <td className="px-4 py-2">{item.category.name}</td>
                                        <td className="px-4 py-2">{item.brand.name}</td>

                                       

                                        <td className="px-4 py-2">
                                            

                                            { item.tags &&  item.tags.length > 0 ? (
                                                <div className="flex items-center w-10 py-0.5 justify-center text-xs rounded-full bg-lime-600 text-white">{ item.tags.length }</div>
                                            ) : (
                                                 <span>--</span>
                                            )} 
                                        </td>
                                        <td className="px-4 py-2">

                                            { (item.variants && item.variants.length > 0) ? (
                                                <div className="flex items-center w-10 py-0.5 justify-center text-xs rounded-full bg-orange-500 text-white">{ item.variants.length }</div>

                                            ) : (
                                                <span>-</span>
                                            )}

                                           
                                        
                                        </td>

                                        <td className="px-4 py-2">{item.visibility}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">

                                            <Link href={`/admin/products/${item.id}`} className="bg-cyan-500 hover:bg-cyan-700 text-white py-1 px-2 rounded">View</Link>
                                           
                                            <Link href={`/admin/products/${item.id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded ml-1">Edit</Link>
                                           
                                           
                                            <button 
                                                onClick={ () => confirmDelete(item) }
                                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-1">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(items.total > items.per_page) && (
                        <PaginationLinks links={items.links} />
                    )}

                    </>

                ) : (
                    <p className="text-gray-600 py-4 ps-1 font-medium">No products found.</p>
                )}

                <br />

            </div>

            <ConfirmDeleteModal size="md" show={showModal} toDelete={toDelete} onDeleteConfirmation={handleDeleteConfirmation} />

        </MainLayout>
    );
};

export default ProductIndex;
