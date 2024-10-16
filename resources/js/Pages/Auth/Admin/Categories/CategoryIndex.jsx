import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import FlashMessage from '@/Components/FlashMessage';
import PaginationLinks from '@/Components/PaginationLinks';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useState } from 'react';

const CategoryIndex = ({ items, filters, flash }) => {
    // const { brands } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    // State for search input
    const [search, setSearch] = useState(filters.search || '');

    // Function to handle search with debounce
    const handleSearch = debounce((query) => {
        router.get(
            route('categories.index'),
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
            router.delete(`/admin/categories/${toDelete.id}`, {
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
                        Categories
                    </h2>
                </>
            }
        >
            <Head title="Categories" />

            <div className="max-full mx-auto max-w-7xl px-4">
                <FlashMessage flash={flash} />

                <div className="mt-4 w-full gap-2 md:flex">
                    <div className="order-2 grow md:order-1">
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={search}
                            onChange={onSearchChange} // Trigger search on input change
                            className="mb-2 w-full rounded border border-gray-300 px-4 py-2"
                        />
                    </div>
                    <Link
                        href={route('categories.create')}
                        className="order-1 mb-2 flex w-full items-center justify-center rounded-md border bg-sky-900 px-3 py-2 text-sm font-medium text-white hover:bg-sky-800 md:order-2 md:w-auto"
                    >
                        + New Category
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
                                            Name
                                        </th>

                                        <th className="px-4 py-2 text-left">
                                            Slug
                                        </th>

                                        <th className="px-4 py-2 text-left">
                                            Parent
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Children (count)
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                            Active
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
                                                {item.slug}
                                            </td>

                                            <td className="px-4 py-2">
                                                {item.parent ? (
                                                    <span>
                                                        {item.parent.name}
                                                    </span>
                                                ) : (
                                                    <span>--</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {item.children.length > 0 ? (
                                                    <div className="w-10 rounded-full bg-lime-600 text-center text-sm font-medium text-white">
                                                        {item.children.length}
                                                    </div>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                {item.active ? (
                                                    <span className="material-symbols-outlined text-[1.2rem] leading-snug text-green-600">
                                                        check_circle
                                                    </span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[1.2rem] leading-snug text-yellow-600">
                                                        cancel
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        router.get(
                                                            `/admin/categories/${item.id}/edit`,
                                                        )
                                                    }
                                                    className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-700"
                                                >
                                                    Edit
                                                </button>
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

                        <PaginationLinks meta={items.meta} className="mb-6" />
                    </>
                ) : (
                    <p className="py-4 ps-1 font-medium text-gray-600">
                        No categories found.
                    </p>
                )}
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

export default CategoryIndex;
