import Navbar from '@/Components/Navbar';
import { useState } from 'react';
export default function MainLayout({ header, children }) {
    const [showDropDown, setShowDropDown] = useState(false);

    // useEffect ( () => {
    //     console.log (user);
    // }, []);

    return (
        <div className="relative flex min-h-dvh flex-col">
            <Navbar />
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
