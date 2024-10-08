import React from "react";
import { router, Link } from '@inertiajs/react';

export default function Thumbs ({ name, className='', withCreateBtn = false  }) {

    const buttonClasses = 'w-full py-1 text-white px-4 rounded bg-gray-400 hover:bg-gray-300 ' + className  ;
    
    return (

        <div className="bg-white h-32 shadow-md rounded-lg text-center relative overflow-hidden">

            <div className="w-full h-full absolute mb-4">

                <img src="/assets/test2.jpg" className="absolute w-full h-full object-cover rounded" alt={name} />
                    
                <div className="bg-gray-900 rounded opacity-50 w-full h-full"></div>

                <h2 className="absolute text-2xl font-semibold mb-2 text-white shadow-lg z-5 top-3 start-4">{name}</h2>

            </div>

            { withCreateBtn ? (

                <div className="grid grid-cols-2 gap-2 absolute w-full z-10 p-3 bottom-0">
                    <Link 
                        href={`/admin/${name.toLowerCase()}`} 
                        className={ buttonClasses }
                    >
                        View
                    </Link>
                    <Link 
                        href={`/admin/${name.toLowerCase()}/create`}
                        className={ buttonClasses }
                    >
                        + Add New
                    </Link>
                </div>

            ) : (

                <div className="grid grid-cols-1 absolute w-full z-10 p-3 bottom-0">
                    <Link 
                        href={`/admin/${name.toLowerCase()}`} 
                        className={ buttonClasses }
                    >
                        View
                    </Link>
                </div>
                
            )}

        </div>

    );
}