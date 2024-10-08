import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const CategoryEdit = ({ category, errors }) => {

    const [name, setName] = useState(category.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/categories/${category.id}`, { name });
    };

    return (

        <AuthenticatedLayout
            header={
                <>
                    <div className="text-sm mb-0.5">
                        <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo; <Link href={'/admin/categories'} className="text-orange-600">Categories</Link> &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Category
                    </h2>
                </>
            }
        >
            <Head title="Edit Category" />

            <div className="max-full max-w-7xl p-4 mx-auto">
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Category Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className={`border rounded w-full py-2 px-3 ${ errors.name ? 'border-red-500' : 'border-gray-500'}`}
                            required 
                        />
                        {errors.name && <p className="text-red-500 text-xs py-1">{errors.name}</p>}
                    </div>
                    
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        Update Category
                    </button>
                </form>
            </div>



        </AuthenticatedLayout>
    );
};

export default CategoryEdit;
