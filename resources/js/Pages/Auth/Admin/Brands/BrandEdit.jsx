import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const BrandEdit = ({ brand, errors }) => {

    const [name, setName] = useState(brand.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/brands/${brand.id}`, { name });
    };

    return (

        <MainLayout
            header={
                <>
                    <div className="text-sm mb-0.5">
                        <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo; <Link href={'/admin/brands'} className="text-orange-600">Brands</Link> &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Brand
                    </h2>
                </>
            }
        >
            <Head title="Edit Brand" />

            <div className="max-full max-w-7xl p-4 mx-auto">
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Brand Name</label>
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
                        Update Brand
                    </button>
                </form>
            </div>



        </MainLayout>
    );
};

export default BrandEdit;
