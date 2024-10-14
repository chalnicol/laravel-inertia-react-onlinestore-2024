import { Link } from '@inertiajs/react';

export default function Thumbs({
    name,
    className = '',
    withCreateBtn = false,
}) {
    const buttonClasses =
        'w-full py-1 text-white px-4 rounded bg-gray-400 hover:bg-gray-300 ' +
        className;

    return (
        <div className="relative h-32 overflow-hidden rounded-lg bg-white text-center shadow-md">
            <div className="absolute mb-4 h-full w-full">
                <img
                    src="/assets/test2.jpg"
                    className="absolute h-full w-full rounded object-cover"
                    alt={name}
                />

                <div className="h-full w-full rounded bg-gray-900 opacity-50"></div>

                <h2 className="z-5 absolute start-4 top-3 mb-2 text-2xl font-semibold text-white shadow-lg">
                    {name}
                </h2>
            </div>

            {withCreateBtn ? (
                <div className="absolute bottom-0 z-10 flex w-full flex-col gap-2 p-3 sm:flex-row">
                    <Link
                        href={`/admin/${name.toLowerCase()}`}
                        className={buttonClasses}
                    >
                        View
                    </Link>
                    <Link
                        href={`/admin/${name.toLowerCase()}/create`}
                        className={buttonClasses}
                    >
                        + Add New
                    </Link>
                </div>
            ) : (
                <div className="absolute bottom-0 z-10 grid w-full p-3">
                    <Link
                        href={`/admin/${name.toLowerCase()}`}
                        className={buttonClasses}
                    >
                        View
                    </Link>
                </div>
            )}
        </div>
    );
}
