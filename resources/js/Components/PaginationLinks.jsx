import React from 'react';
import { Link } from '@inertiajs/react';

export default function PaginationLinks ({ links = [], className = '' }) {


   return (

    <div className={'flex flex-wrap gap-2 ' + className} >
        {links.map((link, index) => (
            link.url ? (
                link.active ? (
                    <span 
                        key={index} 
                        dangerouslySetInnerHTML={{ __html: link.label }} 
                        className={'px-3 py-1 border border-gray-400 rounded text-white bg-sky-600'}
                    />
                ) : (
                    <Link 
                        key={index} 
                        href={link.url} 
                        dangerouslySetInnerHTML={{ __html: link.label }} 
                        className="px-3 py-1 border border-gray-400 rounded text-black"
                    />
                )
            ) : null
        ))}
    </div>


   );


}