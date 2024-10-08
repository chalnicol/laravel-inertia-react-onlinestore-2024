import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Thumbs from '@/Components/Thumbs';

import { Head, router } from '@inertiajs/react';
export default function Dashboard() {

   

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="w-full max-w-7xl mx-auto mt-4 px-2 lg:px-6">
                {/* <h2 className="font-medium px-1 mb-2">Admin Pages</h2> */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">

                    <Thumbs name="Users" className="bg-indigo-500 hover:bg-indigo-600" />

                    <Thumbs name="Products" className="bg-green-500 hover:bg-green-600" withCreateBtn={true} />

                    <Thumbs name="Categories" className="bg-red-500 hover:bg-red-600" withCreateBtn={true} />

                    <Thumbs name="Brands"className="bg-yellow-500 hover:bg-yellow-600" withCreateBtn={true} />

                    <Thumbs name="Tags" className="bg-sky-500 hover:bg-sky-600"  />


                
                </div>
            </div>

            
        </AuthenticatedLayout>
    );
}
