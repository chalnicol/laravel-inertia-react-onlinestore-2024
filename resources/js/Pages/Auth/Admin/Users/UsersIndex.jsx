import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/FlashMessage';
import PaginationLinks from '@/Components/PaginationLinks';
import debounce from 'lodash/debounce';

const UsersIndex = ({ users, filters, auth, flash }) => {

    // State for search input
    const [search, setSearch] = useState(filters.search || '');
    const [showFlashMessage, setShowFlashMessage] = useState(true);

    // Function to handle search with debounce
    const handleSearch = debounce((query) => {
        router.get(route('users.index'), { search: query }, { preserveState: true, replace:true });
    }, 500); 

    // Handle onChange and update search state
    const onSearchChange = (e) => {
        setSearch(e.target.value); // Update search state
        handleSearch(e.target.value); // Trigger search with debounce
    };
    
    const changeRole = ( user ) => {
        router.put (`/admin/users/${user.id}`);
    }

    const closeFlashMessaging = () => {
        setShowFlashMessage (false)
    };

    useEffect (() => {
        setShowFlashMessage (true); 
    }, [flash]);

    return (

        <AuthenticatedLayout 
            header={
                <>
                    <div className="text-sm mb-0.5">
                        <Link href={'/admin'} className="text-orange-600">Admin</Link> &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Users
                    </h2>
                </>
            }
        >
            <Head title="Users" />
            
            <div className="max-full max-w-7xl px-4 mx-auto">

                

            <FlashMessage flash={flash} />

                <div className="md:flex gap-2 w-full mt-4">

                    <div className="grow">
                        <input
                            type="text"
                            placeholder="Filter users..."
                            value={search}
                            onChange={onSearchChange} // Trigger search on input change
                            className="border border-gray-300 px-4 py-2 rounded w-full mb-2"
                        />
                    </div>
                   
                </div>
               
                {(users.data && users.data.length > 0) ? (
                    <>
                    <div className="overflow-x-auto w-full mb-6">
                        <table className="min-w-[600px] w-full text-sm">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Is_Admin</th>
                                    <th className="px-4 py-2 text-left">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map(user => (
                                    <tr key={user.id} className="odd:bg-gray-100 even:bg-gray-200 border-gray-300">
                                        <td className="px-4 py-2">{user.id}</td>
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2">{user.email}</td>

                                        <td className="px-4 py-2">
                                           <span>{ user.is_admin ? 'Yes' : 'No' }</span>
                                        </td>      

                                        <td className="px-4 py-2">
                                            { user.is_admin ? (
                                                auth.user.id === user.id ? (
                                                    <span>-</span>
                                                ): (
                                                    <button 
                                                        className="min-w-[150px] px-2 py-1 rounded bg-red-500 text-white text-xs"
                                                        onClick={ () => changeRole(user)}
                                                    >
                                                        Remove As Admin
                                                    </button>
                                                )
                                            ) : (
                                                <button 
                                                    className="min-w-[150px] px-2 py-1 rounded bg-green-500 text-white text-xs"
                                                    onClick={ () => changeRole(user)}
                                                >
                                                    Set Admin
                                                </button>
                                            )}
                                        </td>        
                                                                         
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                   
                    {(users.total > users.per_page) && (
                        <PaginationLinks links={users.links} />
                    )}

                    </>

                ) : (
                    <p className="text-gray-600 py-4 ps-1 font-medium">No users found.</p>
                )}

                <br />
                

            </div>

        </AuthenticatedLayout>
    );
};

export default UsersIndex;
