import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import FlashMessage from '@/Components/FlashMessage';
import PaginationLinks from '@/Components/PaginationLinks';


const CategoryIndex = ({ items, filters, flash }) => {

    // const { brands } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    // State for search input
    const [search, setSearch] = useState(filters.search || '');

    // Function to handle search with debounce
    const handleSearch = debounce((query) => {
        router.get(route('categories.index'), { search: query }, { preserveState: true, replace:true });
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

        <AuthenticatedLayout 
            header={
                <>
                    <div className="text-sm mb-0.5">
                        <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Categories
                    </h2>
                </>
            }
        >
            <Head title="Categories" />
            
            <div className="max-full max-w-7xl px-4 mx-auto">

                <FlashMessage flash={flash} />

                <div className="md:flex gap-2 w-full mt-4">

                    <div className="grow order-2 md:order-1">
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={search}
                            onChange={onSearchChange} // Trigger search on input change
                            className="border border-gray-300 px-4 py-2 rounded w-full mb-2"
                        />
                    </div>
                    <Link href={route('categories.create')} className="order-1 md:order-2 w-full mb-2 md:w-auto bg-sky-900 hover:bg-sky-800 text-white px-3 py-2 rounded-md border text-sm font-medium flex items-center justify-center">
                        + New Category
                    </Link>
                    
                   
                </div>
               
                {(items.data && items.data.length > 0) ? (
                    <>
                    <div className="overflow-x-auto w-full mb-6">
                        <table className="min-w-[600px] w-full text-sm">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Product Linked</th>

                                    <th className="px-4 py-2 text-left">Slug</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.data.map(item => (
                                    <tr key={item.id} className="odd:bg-gray-100 even:bg-gray-200 border-gray-300">
                                        <td className="px-4 py-2">{item.id}</td>
                                        <td className="px-4 py-2">{item.name}</td>
                                        <td className="px-4 py-2">{item.products.length}</td>

                                        <td className="px-4 py-2">{item.slug}</td>
                                        <td className="px-4 py-2">
                                            <button 
                                                onClick={() => router.get(`/admin/categories/${item.id}/edit`)} 
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded">
                                                Edit
                                            </button>
                                            <button 
                                                onClick={ () => confirmDelete(item) }
                                                className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-2">
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
                    <p className="text-gray-600 py-4 ps-1 font-medium">No categories found.</p>
                )}

                

            </div>

            <ConfirmDeleteModal size="md" show={showModal} toDelete={toDelete} onDeleteConfirmation={handleDeleteConfirmation} />


        </AuthenticatedLayout>
    );
};

export default CategoryIndex;
