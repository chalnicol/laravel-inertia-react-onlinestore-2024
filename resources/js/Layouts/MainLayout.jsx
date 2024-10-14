import { Link, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function MainLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showDropDown, setShowDropDown] = useState(false);

    const dropdownRef = useRef(null);

    const toggleDropDown = () => {
        setShowDropDown((prevValue) => !prevValue);
    };

    const handleBlur = (e) => {
        // Check if the clicked element is outside the dropdown
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.relatedTarget)
        ) {
            setShowDropDown(false);
        }
    };

    // useEffect ( () => {
    //     console.log (user);
    // }, []);

    return (
        <div className="flex min-h-dvh flex-col">
            <nav className="h-[58px] max-h-[58px] bg-sky-800">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2"
                        >
                            <img
                                src="/assets/logo.png"
                                alt="logo"
                                className="w-28 object-contain"
                            />
                        </Link>
                    </div>

                    <div className="text-sm">
                        {user ? (
                            <div className="inline-flex items-center space-x-4">
                                <Link className="select-none text-white hover:text-gray-300">
                                    <span className="material-symbols-outlined text-xl">
                                        shopping_cart
                                    </span>
                                </Link>

                                {user && user.is_admin ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="text-sm font-medium text-white hover:text-gray-300"
                                    >
                                        Admin
                                    </Link>
                                ) : null}

                                <div
                                    ref={dropdownRef}
                                    className="relative z-20"
                                >
                                    <button
                                        type="button"
                                        onClick={toggleDropDown}
                                        onBlur={handleBlur}
                                        className="inline-flex items-center rounded-md border border-transparent py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:text-gray-300 focus:outline-none"
                                    >
                                        {user.name}

                                        <span className="material-symbols-outlined">
                                            arrow_drop_down
                                        </span>
                                    </button>

                                    {showDropDown && (
                                        <div className="absolute end-0 flex min-w-36 flex-col items-end overflow-hidden rounded bg-white shadow-lg">
                                            <Link
                                                href={route('profile.edit')}
                                                className="w-full hover:bg-gray-200"
                                            >
                                                <div className="w-full px-3 py-2">
                                                    Profile
                                                </div>
                                            </Link>

                                            <Link
                                                className="w-full px-3 py-2 text-start hover:bg-gray-200"
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
                                <Link
                                    href={route('login')}
                                    className="text-gray-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-gray-200"
                                >
                                    Register
                                </Link>
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

            <main className="grow">{children}</main>

            <footer className="bg-sky-800">
                <div className="mx-auto max-w-7xl px-4 py-1 text-center text-xs text-gray-50 sm:px-6 lg:px-8">
                    &copy; 2024 ManongCentral. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
