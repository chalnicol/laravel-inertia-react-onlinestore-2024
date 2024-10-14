import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const CategoryEdit = ({ category, categories, errors }) => {
    const [name, setName] = useState(category.name);
    const [parentId, setParentId] = useState(category.parent_id || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/categories/${category.id}`, {
            name: name,
            parent_id: parentId != '' ? parentId : null,
        });
    };

    return (
        <MainLayout
            header={
                <>
                    <div className="mb-0.5 text-sm">
                        <Link href={'/admin'} className="text-orange-600">
                            Admin
                        </Link>{' '}
                        &raquo;{' '}
                        <Link
                            href={'/admin/categories'}
                            className="text-orange-600"
                        >
                            Categories
                        </Link>{' '}
                        &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Category
                    </h2>
                </>
            }
        >
            <Head title="Edit Category" />

            <div className="max-full mx-auto max-w-7xl p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full rounded border px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-500'}`}
                            required
                        />
                        {errors.name && (
                            <p className="py-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Select Parent Category
                        </label>
                        <select
                            name="parent_id"
                            value={parentId}
                            className="w-full rounded px-3 py-2 text-gray-700"
                            onChange={(e) => setParentId(e.target.value)}
                        >
                            <option value="">-select parent-</option>
                            {categories.data &&
                                categories.data.length > 0 &&
                                categories.data.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                        {errors.parent_id && (
                            <p className="py-1 text-xs text-red-500">
                                {errors.parent_id}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Update Category
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default CategoryEdit;
