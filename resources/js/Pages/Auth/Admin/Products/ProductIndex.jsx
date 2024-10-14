import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import FlashMessage from '@/Components/FlashMessage';
import PaginationLinks from '@/Components/PaginationLinks';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useState } from 'react';

const ProductIndex = ({ items, filters, flash }) => {
    // const { brands } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    // State for search input
    const [search, setSearch] = useState(filters.search || '');

    // Function to handle search with debounce
    const handleSearch = debounce((query) => {
        router.get(
            route('products.index'),
            { search: query },
            { preserveState: true, replace: true },
        );
    }, 500);

    // Handle onChange and update search state
    const onSearchChange = (e) => {
        setSearch(e.target.value); // Update search state
        handleSearch(e.target.value); // Trigger search with debounce
    };

    const confirmDelete = (item) => {
        setToDelete(item);
        setShowModal(true);
    };
    const handleDeleteConfirmation = (confirmed) => {
        if (confirmed) {
            router.delete(`/admin/products/${toDelete.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            setShowModal(false);
        }
    };

    console.log(items);

    return (
        <MainLayout
            header={
                <>
                    <div className="mb-0.5 text-sm">
                        <Link href={'/admin'} className="text-orange-600">
                            Admin
                        </Link>{' '}
                        &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Products
                    </h2>
                </>
            }
        >
            <Head title="Products" />

            <div className="max-full mx-auto max-w-7xl px-4">
                <FlashMessage flash={flash} />

                <div className="mt-3 w-full gap-2 md:flex">
                    <div className="grow">
                        <input
                            type="text"
                            placeholder="Filter products..."
                            value={search}
                            onChange={onSearchChange} // Trigger search on input change
                            className="mb-2 w-full rounded border border-gray-300 px-4 py-2"
                        />
                    </div>
                    <Link
                        href={route('products.create')}
                        className="mb-2 flex w-full items-center justify-center rounded-md border bg-sky-900 px-3 py-2 text-sm font-medium text-white hover:bg-sky-800 md:w-auto"
                    >
                        + New Product
                    </Link>
                </div>

                {items.data && items.data.length > 0 ? (
                    <>
                        <div className="mb-6 w-full overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="px-4 py-2 text-left">
                                            #
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Image
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Name
                                        </th>
                                        {/* <th className="px-4 py-2 text-left">Description</th> */}
                                        <th className="px-4 py-2 text-left">
                                            Price
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Category
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Brand
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Tags
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Variants
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Visibility
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-gray-300 odd:bg-gray-100 even:bg-gray-200"
                                        >
                                            <td className="px-4 py-2">
                                                {item.id}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.image ? (
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-6 w-6 border border-gray-300 object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={`/assets/noimage.png`}
                                                        alt={item.name}
                                                        className="h-6 w-6 border border-gray-300 object-cover"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.name}
                                            </td>
                                            {/* <td className="px-4 py-2">
                                            {item.description.substring(0, 10)}...
                                        </td> */}
                                            <td className="px-4 py-2">
                                                {item.base_price
                                                    ? `₱${item.base_price}`
                                                    : '--'}
                                            </td>

                                            <td className="px-4 py-2">
                                                {item.category.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.brand.name}
                                            </td>

                                            <td className="px-4 py-2">
                                                {item.tags &&
                                                item.tags.length > 0 ? (
                                                    <div className="flex w-10 items-center justify-center rounded-full bg-lime-600 py-0.5 text-xs text-white">
                                                        {item.tags.length}
                                                    </div>
                                                ) : (
                                                    <span>--</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.variants &&
                                                item.variants.length > 0 ? (
                                                    <div className="flex w-10 items-center justify-center rounded-full bg-orange-500 py-0.5 text-xs text-white">
                                                        {item.variants.length}
                                                    </div>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {item.visibility}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                                <Link
                                                    href={`/admin/products/${item.id}`}
                                                    className="rounded bg-cyan-500 px-2 py-1 text-white hover:bg-cyan-700"
                                                >
                                                    View
                                                </Link>

                                                <Link
                                                    href={`/admin/products/${item.id}/edit`}
                                                    className="ml-1 rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-700"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        confirmDelete(item)
                                                    }
                                                    className="ml-1 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <PaginationLinks meta={items.meta} />
                    </>
                ) : (
                    <p className="py-4 ps-1 font-medium text-gray-600">
                        No products found.
                    </p>
                )}

                <br />
            </div>

            <ConfirmDeleteModal
                size="md"
                show={showModal}
                toDelete={toDelete}
                onDeleteConfirmation={handleDeleteConfirmation}
            />
        </MainLayout>
    );
};

export default ProductIndex;
