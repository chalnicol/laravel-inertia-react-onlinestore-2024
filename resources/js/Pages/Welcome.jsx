import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    

    return (
        // <>
        //     <Head title="Welcome" />
        //     <div className="bg-gray-100 h-screen flex flex-col text-gray-800">
                
        //         <nav className="flex items-center justify-end text-black w-full bg-gray-100 h-12 shadow-lg">
        //             {auth.user ? (
        //                 <Link
        //                     href={route('home')}
        //                     className="rounded-md px-3 py-2 text-black hover:text-black/70"
        //                 >
        //                     Home
        //                 </Link>
        //             ) : (
        //                 <>
        //                     <Link
        //                         href={route('login')}
        //                         className="rounded-md px-3 py-2 text-black hover:text-black/70"
        //                     >
        //                         Log in
        //                     </Link>
        //                     <Link
        //                         href={route('register')}
        //                         className="rounded-md px-3 py-2 text-black hover:text-black/70"
        //                     >
        //                         Register
        //                     </Link>
        //                 </>
        //             )}
        //         </nav>

        //         <main className="text-center grow flex items-center justify-center">
        //             <div className="border border-gray-500 shadow-lg w-[90%] max-w-2xl p-2 rounded-lg  bg-gray-100">
        //                 <div className="border-4 border-gray-500 py-6 rounded-lg">
        //                     <h1 className="font-bold text-3xl lg:text-6xl">CEN Online Store</h1>
        //                     <hr className="w-[90%] mx-auto my-3 border border-gray-500"/>
        //                     <p className="p-1 lg:text-lg">Administrator Website</p>
        //                 </div>
        //             </div>
        //         </main>
        
        //         <footer className="text-center text-xs py-1 border-t border-gray-300 bg-white">
        //             Laravel v{laravelVersion} (PHP v{phpVersion}) | @2024 Nicolas Production
        //         </footer>
                
        //     </div>
        // </>

        <GuestLayout>
            <Head title="Welcome" />

                <nav className="flex items-center justify-center text-black w-full">
                    <Link
                        href={route('login')}
                        className="rounded-md px-3 py-2 text-black hover:text-black/70"
                    >
                        Log in
                    </Link>
                    <Link
                        href={route('register')}
                        className="rounded-md px-3 py-2 text-black hover:text-black/70"
                    >
                        Register
                    </Link>
                </nav>

                <main className="text-center flex items-center justify-center py-2 my-2 border-y-2 border-gray-200 w-[90%] mx-auto">
                     
                    <div className="w-full">
                        <h1 className="font-bold bg-black text-white text-3xl py-1">CEN ONLINE STORE</h1>
                        <p className="p-1 text-gray-500">Administrator Website</p>
                    </div>
                </main>

                <footer className="text-center text-gray-400 text-xs py-1 bg-white">
                    @2024 Nicolas Production 
                     {/* Laravel v{laravelVersion} (PHP v{phpVersion}) | @2024 Nicolas Production */}
                </footer>

        </GuestLayout>
    );
}
