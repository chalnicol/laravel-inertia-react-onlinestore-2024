import { Link } from '@inertiajs/react';

export default function PaginationLinks({ meta = {}, className = '' }) {
    return (
        <>
            <div className={className}>
                {meta.total > 0 && (
                    <p className="mb-2 mt-2 text-xs text-gray-500">
                        Showing {meta.from} to {meta.to} of {meta.total} Entries
                    </p>
                )}
                {meta.total > meta.per_page && (
                    <div className={'flex flex-wrap gap-2'}>
                        {meta.links.map((link, index) =>
                            link.url ? (
                                link.active ? (
                                    <span
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={
                                            'rounded border border-gray-500 bg-sky-700 px-3 py-1 text-white'
                                        }
                                    />
                                ) : (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className="rounded border border-gray-500 bg-transparent px-3 py-1 text-black"
                                    />
                                )
                            ) : null,
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
