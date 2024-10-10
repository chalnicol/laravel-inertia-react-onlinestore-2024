import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import React, { useState, useRef } from 'react';

export default function MainLayout ({ header, children }) {

    const user = usePage().props.auth.user;

    const [showDropDown, setShowDropDown] = useState(false);

    const dropdownRef = useRef(null);

    const toggleDropDown = () => {
        setShowDropDown( prevValue => !prevValue);
    }
    
    const handleBlur = (e) => {
        // Check if the clicked element is outside the dropdown
        if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
            setShowDropDown(false);
        }
    };

    // useEffect ( () => {
    //     console.log (user);
    // }, []);

    return (
        <div className="min-h-screen">

            <nav className="h-[58px] max-h-[58px] bg-sky-800">
                <div className="h-full max-w-7xl mx-auto flex justify-between items-center px-4">

                    <div className="flex items-center gap-3">
                        
                        <Link href="/" className="inline-flex gap-2 items-center ">
                            <ApplicationLogo className="w-8"/>
                            <span className="text-lg font-bold text-white">maNong CENtral</span>
                        </Link>

                       
                       
                    </div>

                    <div className="text-sm">
                        { user ? (

                            <div className="inline-flex space-x-4 items-center">


                                <Link className="text-white hover:text-gray-300 select-none">
                                    <span className="material-symbols-outlined text-xl">
                                        shopping_cart
                                    </span>
                                </Link>

                                {user && user.is_admin ? (
                                    <Link href={route('admin.dashboard')} className="font-medium text-sm text-white hover:text-gray-300">Admin</Link>
                                ) : null }

                                <div ref={dropdownRef} className="relative">
                                    <button
                                        type="button"
                                        onClick={toggleDropDown}
                                        onBlur={handleBlur}
                                        className="inline-flex items-center rounded-md border border-transparent py-2 text-sm font-medium leading-4 text-white hover:text-gray-300 transition duration-150 ease-in-out  focus:outline-none"
                                    >
                                        {user.name}

                                        <span className="material-symbols-outlined">
                                            arrow_drop_down
                                        </span>
                                        
                                    </button>


                                    {showDropDown && (
                                        
                                        <div className="absolute shadow-lg flex flex-col items-end bg-white min-w-36 end-0 rounded overflow-hidden">
                                            
                                         
                                           <Link href={route('profile.edit')} className="w-full hover:bg-gray-200">
                                            <div className="w-full py-2 px-3">Profile</div>
                                           </Link>

                                           <Link 
                                                className="w-full text-start py-2 px-3 hover:bg-gray-200"
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Link>

                                           

                                            

                                           
                                        </div>
                                    )}

                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link href={route('login')} className="text-gray-200">Login</Link>
                                <Link href={route('register')} className="text-gray-200">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
