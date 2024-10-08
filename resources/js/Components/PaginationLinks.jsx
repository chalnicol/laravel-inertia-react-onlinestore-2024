import React from 'react';
import { Link } from '@inertiajs/react';

export default function PaginationLinks ({ links = [], className = '' }) {

   return (

    <div className={className} >
        {links.map((link, index) => (
            link.url ? (
                link.active ? (
                    <span 
                        key={index} 
                        dangerouslySetInnerHTML={{ __html: link.label }} 
                        className={`inline-block px-4 py-2 mx-1 border border-gray-400 rounded bg-gray-800 text-white`}
                    />
                ) : (
                    <Link 
                        key={index} 
                        href={link.url} 
                        dangerouslySetInnerHTML={{ __html: link.label }} 
                        className={`inline-block px-4 py-2 mx-1 border border-gray-400 rounded text-black`}
                    />
                )
            ) : null
        ))}
    </div>


   );


}