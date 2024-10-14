import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import FlashMessage from '@/Components/FlashMessage';
import PaginationLinks from '@/Components/PaginationLinks';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useState } from 'react';

const TagIndex = ({ items, filters, flash }) => {
    // const { brands } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    // State for search input
    const [search, setSearch] = useState(filters.search || '');

    // Function to handle search with debounce
    const handleSearch = debounce((query) => {
        router.get(
            route('tags.index'),
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
            router.delete(`/admin/tags/${toDelete.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            setShowModal(false);
        }
    };

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
                        Tags
                    </h2>
                </>
            }
        >
            <Head title="Tags" />

            <div className="max-full mx-auto max-w-7xl px-4">
                <FlashMessage flash={flash} />

                <div className="mt-4 w-full gap-2 md:flex">
                    <div className="grow">
                        <input
                            type="text"
                            placeholder="Filter tags..."
                            value={search}
                            onChange={onSearchChange} // Trigger search on input change
                            className="mb-2 w-full rounded border border-gray-300 px-4 py-2"
                        />
                    </div>
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
                                            Name
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Product Linked
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
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.products.length}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(item)
                                                    }
                                                    className="ml-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
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
                        No tags found.
                    </p>
                )}
            </div>
            <br />
            <ConfirmDeleteModal
                size="md"
                show={showModal}
                toDelete={toDelete}
                onDeleteConfirmation={handleDeleteConfirmation}
            />
        </MainLayout>
    );
};

export default TagIndex;
