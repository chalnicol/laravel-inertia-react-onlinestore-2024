import CategoryItem from '@/Components/CategoryItem';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const CategoryEdit = ({ category, categories, errors }) => {
    const [name, setName] = useState(category.name);
    const [parentId, setParentId] = useState(category.parent_id || '');
    const [isActive, setIsActive] = useState(category.active || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/categories/${category.id}`, {
            name: name,
            parent_id: parentId != '' ? parentId : null,
            active: isActive,
        });
    };

    const handleCategorySelect = (id) => {
        console.log('asdf', id);
        setParentId(id);
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
                        <div className="h-44 overflow-auto rounded border border-gray-500 bg-white p-1">
                            {categories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    selected={[parentId]}
                                    onSelect={handleCategorySelect}
                                    editingCategoryId={category.id}
                                />
                            ))}
                        </div>
                        {errors.parent_id && (
                            <p className="py-1 text-xs text-red-500">
                                {errors.parent_id}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <div>
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={() =>
                                    setIsActive((prevValue) => !prevValue)
                                }
                            />
                            <label
                                htmlFor="isActive"
                                className="ml-2 text-gray-700"
                            >
                                Is Active
                            </label>
                        </div>
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
