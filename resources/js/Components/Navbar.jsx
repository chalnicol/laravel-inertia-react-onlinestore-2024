import { Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';

const Navbar = () => {
    const user = usePage().props.auth.user;

    const cartCount = usePage().props.cartCount;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const responsiveDropdownRef = useRef(null);

    const toggleDropDown = () => {
        setDropdownOpen((prevValue) => !prevValue);
    };

    const toggleResponsiveDropdown = () => {
        // setResponsiveDropdownOpen((prevValue) => !prevValue);
        if (!responsiveDropdownOpen) {
            openDropDownAnimation();
        } else {
            closeDropDownAnimation();
        }
    };

    const openDropDownAnimation = () => {
        setResponsiveDropdownOpen(true);
        gsap.fromTo(
            responsiveDropdownRef.current,
            { height: 0 },
            {
                height: 'auto',
                duration: 0.5,
                ease: 'power4.out',
            },
        );
    };

    const closeDropDownAnimation = () => {
        gsap.to(responsiveDropdownRef.current, {
            height: 0,
            duration: 0.5,
            ease: 'power4.out',
            onComplete: () => setResponsiveDropdownOpen(false),
        });
    };

    const handleBlur = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.relatedTarget)
        ) {
            setDropdownOpen(false);
        }
    };

    const [menuOpen, setMenuOpen] = useState(false);

    const showMenu = (show = true) => {
        if (show) {
            gsap.to('#responsive-menu', {
                xPercent: -100,
                duration: 0.3,
                ease: 'power4.out',
            });
        } else {
            gsap.to('#responsive-menu', {
                xPercent: 0,
                duration: 0.3,
                ease: 'power4.out',
                onComplete: () => setMenuOpen(false),
            });
        }
    };

    const handleToggleMenu = () => {
        if (!menuOpen) {
            showMenu();
            setMenuOpen(true);
        } else {
            showMenu(false);
        }
    };

    window.addEventListener('resize', () => {
        // console.log (navShown, window.innerWidth);
        // setMenuOpen ( window.innerWidth <= 640 && navShown );
        setMenuOpen(false);
    });

    return (
        <nav className="sticky top-0 z-30 h-16 w-full border-gray-300 bg-sky-900 text-sm text-white shadow-md">
            <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 xl:px-0">
                <div id="nav-left" className="flex items-center gap-4">
                    <div id="nav-brand">
                        <Link href="/">
                            <img
                                src="/assets/logo.png"
                                alt="logo"
                                className="w-28 object-contain"
                            />
                        </Link>
                    </div>
                </div>

                <div id="nav-right" className="flex items-center gap-4">
                    <Link
                        href={route('cart.index')}
                        className="select-none text-white hover:text-gray-300"
                    >
                        <div className="relative">
                            <span className="material-symbols-outlined text-xl leading-loose">
                                shopping_cart
                            </span>
                            {cartCount > 0 && (
                                <span className="absolute end-[-0.5rem] top-[0.1rem] flex h-4 min-w-[15px] items-center justify-center rounded-full bg-red-500 px-1 text-[0.6rem] text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>
                    <div id="nav-right-links" className="hidden md:block">
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    {user.is_admin && (
                                        <Link href={route('admin.dashboard')}>
                                            Admin
                                        </Link>
                                    )}

                                    <div className="relative">
                                        <button
                                            className="flex select-none items-center"
                                            onClick={toggleDropDown}
                                            onBlur={handleBlur}
                                        >
                                            {user.name}
                                            <span className="material-symbols-outlined">
                                                arrow_drop_down
                                            </span>
                                        </button>

                                        <div
                                            ref={dropdownRef}
                                            className={`absolute end-0 z-20 mt-2 flex w-32 flex-col overflow-hidden rounded bg-white text-black shadow-lg ${dropdownOpen ? 'block' : 'hidden'}`}
                                        >
                                            <Link
                                                href={route('profile.edit')}
                                                className="w-full px-4 py-2 text-right hover:bg-gray-200"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full px-4 py-2 text-right hover:bg-gray-200"
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>Login</Link>
                                    <Link href={route('register')}>
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div id="nav-right-hamburger" className="md:hidden">
                        <span
                            className="material-symbols-outlined leading-normal active:scale-90"
                            onClick={handleToggleMenu}
                        >
                            menu
                        </span>
                    </div>
                </div>

                <div
                    id="responsive-menu-container"
                    className={`z-100 absolute start-0 top-14 h-[calc(100vh-3rem)] w-full overflow-hidden bg-gray-300 md:hidden ${menuOpen ? 'block' : 'hidden'}`}
                    style={{ backgroundColor: '#0a0a0add' }}
                >
                    <div
                        id="responsive-menu"
                        className="absolute start-full h-full w-10/12 bg-gray-500"
                    >
                        {user ? (
                            <div className="flex flex-col">
                                {user.is_admin && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="border-b border-gray-300 px-5 py-4 text-right"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="flex flex-col border-b border-gray-300">
                                    <button
                                        className="flex select-none items-center justify-end px-2 py-4"
                                        onClick={toggleResponsiveDropdown}
                                    >
                                        {user.name}
                                        <span className="material-symbols-outlined">
                                            {!responsiveDropdownOpen
                                                ? 'arrow_drop_down'
                                                : 'arrow_drop_up'}
                                        </span>
                                    </button>

                                    <div
                                        ref={responsiveDropdownRef}
                                        className={`w-full overflow-hidden ${responsiveDropdownOpen ? 'block' : 'hidden'}`}
                                    >
                                        <div className="flex flex-col">
                                            <Link
                                                href={route('profile.edit')}
                                                className="w-full border-t border-gray-300 bg-gray-600 px-5 py-4 text-right"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full border-t border-gray-300 bg-gray-600 px-5 py-4 text-right"
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <Link
                                    href={route('login')}
                                    className="border-b border-gray-300 px-5 py-4 text-right"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="border-b border-gray-300 px-5 py-4 text-right"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
