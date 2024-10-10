import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function AlternateLayout ({ children }) {
    return (
        <div className="w-full bg-gray-100 relative">
            <nav className="h-[60px] bg-sky-800">
                <div className="h-full max-w-7xl mx-auto flex justify-center items-center px-4">
                    <Link href="/" className="text-xl font-semibold text-white">maNong CENtral</Link>
                </div>
            </nav>

            <div className="min-h-[calc(100dvh-60px)] flex flex-col justify-center items-center gap-y-3 py-6"> 
                
                <Link href="/">
                     <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
                <div className="w-11/12 md:w-full bg-white max-w-lg mx-auto border-2 border-gray-200 rounded-lg p-6 shadow-md overflow-hidden">
                    {children}
                </div>

            </div>

        </div>
    );
}
