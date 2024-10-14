import Thumbs from '@/Components/Thumbs';
import AuthenticatedLayout from '@/Layouts/MainLayout';

import { Head } from '@inertiajs/react';
export default function Dashboard() {
    return (
        <AuthenticatedLayout
        // header={
        //     <h2 className="text-xl font-semibold leading-tight text-gray-800">
        //         Dashboard
        //     </h2>
        // }
        >
            <Head title="Admin Dashboard" />

            <div className="mx-auto w-full max-w-7xl overflow-hidden">
                <div className="grid gap-2 p-4 md:grid-cols-2 lg:grid-cols-3">
                    <Thumbs
                        name="Users"
                        className="bg-indigo-500 hover:bg-indigo-600"
                    />

                    <Thumbs
                        name="Products"
                        className="bg-green-500 hover:bg-green-600"
                        withCreateBtn={true}
                    />

                    <Thumbs
                        name="Categories"
                        className="bg-red-500 hover:bg-red-600"
                        withCreateBtn={true}
                    />

                    <Thumbs
                        name="Brands"
                        className="bg-yellow-500 hover:bg-yellow-600"
                        withCreateBtn={true}
                    />

                    <Thumbs
                        name="Tags"
                        className="bg-sky-500 hover:bg-sky-600"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
