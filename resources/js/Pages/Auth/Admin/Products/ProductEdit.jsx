import FileInput from '@/Components/FileInput';
import SelectSearch from '@/Components/SelectSearch';
import TagsInput from '@/Components/TagsInput';
import VariantInput from '@/Components/VariantInput';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const ProductEdit = ({ product, errors }) => {
    const [formData, setFormData] = useState({
        image: null,
        name: product.name || '',
        cost_price: product.cost_price || '',
        base_price: product.base_price || '',
        promo_discount: product.promo_discount || '',
        promo_start: product.promo_start || '',
        promo_end: product.promo_end || '',
        quantity: product.quantity || '',
        description: product.description || '',
        category_id: product.category.id || '',
        brand_id: product.brand.id || '',
        tags: [],
        visibility: product.visibility,
        variants: product.variants || [],
        _method: 'PUT',
    });

    const [processing, setProcessing] = useState(false);

    const [variants, setVariants] = useState(product.variants || []);
    const [tags, setTags] = useState(
        product.tags && product.tags.length > 0
            ? product.tags.map((tag) => tag.name)
            : [],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const updatedFormData = { ...formData, variants: variants, tags: tags };

        router.post(`/admin/products/${product.id}`, updatedFormData, {
            forceFormData: true,
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBrandChange = (value) => {
        console.log(value);
        setFormData((prevData) => ({
            ...prevData,
            brand_id: value[0] || null,
        }));
    };

    const handleCategoryChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            category_id: value[0] || null,
        }));
    };

    const handleTagsChange = (value) => {
        setTags(value);
        // setFormData((prevData) => ({
        //     ...prevData,
        //     tags: value,
        // }));
    };

    const handleImageChange = (e) => {
        // console.log('image changed', e.target.files[0]);
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0],
        }));
    };

    const handleFileInputChange = (files) => {
        // console.log('image changed', e.target.files[0]);
        setFormData((prevData) => ({
            ...prevData,
            image: files ? files[0] : null,
        }));
    };

    const handleAddVariant = () => {
        // Add a new entry for a variant
        setVariants([
            ...variants,
            {
                id: generateRandomVariantId(),
                variant_name: '',
                variant_quantity: '',
                variant_image: null,
                variant_base_price: '',
                variant_promo_price: '',
                variant_cost_price: '',
            },
        ]);
    };

    const handleVariantChange = (updatedVariantData, id) => {
        setVariants((prevVariants) =>
            prevVariants.map((variant) =>
                variant.id === id
                    ? { ...variant, ...updatedVariantData }
                    : variant,
            ),
        );
    };

    const handleRemoveVariant = (idToRemove) => {
        setVariants((prevVariants) =>
            prevVariants.filter((variant) => variant.id !== idToRemove),
        );
    };

    const generateRandomVariantId = () => {
        return Math.random().toString(36).substring(2, 9); // Generates a random string of 9 characters
    };

    const formattedErrors = useMemo(() => {
        // console.log (errors);

        let variants = {};

        Object.keys(errors).forEach((field) => {
            const keys = field.split('.');

            if (keys[0] === 'variants') {
                const variantIndex = parseInt(keys[1]);
                const variantField = keys[2];

                if (!variants[variantIndex]) {
                    variants[variantIndex] = {};
                }
                variants[variantIndex][variantField] = errors[field];
            }
        });

        return {
            variants: variants,
        };
    }, [errors]);

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
                            href={'/admin/products'}
                            className="text-orange-600"
                        >
                            Products
                        </Link>{' '}
                        &raquo;
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Product
                    </h2>
                </>
            }
        >
            <Head title="Edit Product" />

            <div className="max-full mx-auto max-w-7xl p-4">
                <form onSubmit={handleSubmit}>
                    <h5 className="py-0 font-medium text-gray-500">
                        Product Data
                    </h5>
                    <hr className="mb-4 mt-1 border-r border-gray-400" />

                    <div className="grid-cols-2 gap-x-6 lg:grid">
                        <div>
                            <div className="mb-4">
                                <FileInput
                                    className={`${errors.image ? 'border-red-500' : 'border-gray-500'}`}
                                    label="upload image here"
                                    onFileInputChange={handleFileInputChange}
                                />
                                {errors.image && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full rounded border px-3 py-2 text-sm ${errors.name ? 'border-red-500' : 'border-gray-500'}`}
                                    placeholder="input name here"
                                />
                                {errors.name && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className={`w-full rounded border px-3 py-2 text-sm ${errors.quantity ? 'border-red-500' : 'border-gray-500'}`}
                                    placeholder="input quantity here"
                                />
                                {errors.quantity && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.quantity}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                {/* <SelectSearch resource="brands" multiSelect={false} error={errors.brand_id} onValueChange={handleBrandChange} /> */}

                                <SelectSearch
                                    className={`${errors.brand_id ? 'border-red-500' : 'border-gray-500'}`}
                                    value={product.brand}
                                    resource="brands"
                                    maxSelect="1"
                                    onValueChange={handleBrandChange}
                                />
                                {errors.brand_id && (
                                    <div className="text-xs text-red-500">
                                        {errors.brand_id}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <SelectSearch
                                    className={`${errors.category_id ? 'border-red-500' : 'border-gray-500'}`}
                                    value={product.category}
                                    resource="categories"
                                    maxSelect="1"
                                    onValueChange={handleCategoryChange}
                                />
                                {errors.category_id && (
                                    <div className="text-xs text-red-500">
                                        {errors.category_id}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <textarea
                                    name="description"
                                    onChange={handleInputChange}
                                    value={formData.description}
                                    className="block min-h-24 w-full rounded text-sm lg:min-h-28"
                                    placeholder="input description here"
                                ></textarea>
                                {errors.description && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="cost_price"
                                    value={formData.cost_price}
                                    onChange={handleInputChange}
                                    className={`w-full rounded border px-3 py-2 text-sm ${errors.cost_price ? 'border-red-500' : 'border-gray-500'}`}
                                    placeholder="input cost price here"
                                />
                                {errors.cost_price && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.cost_price}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="base_price"
                                    value={formData.base_price}
                                    onChange={handleInputChange}
                                    className={`w-full rounded border px-3 py-2 text-sm ${errors.base_price ? 'border-red-500' : 'border-gray-500'}`}
                                    placeholder="input base price here"
                                />
                                {errors.base_price && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.base_price}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="promo_discount"
                                    value={formData.promo_discount}
                                    onChange={handleInputChange}
                                    className={`w-full rounded border px-3 py-2 text-sm ${errors.promo_discount ? 'border-red-500' : 'border-gray-500'}`}
                                    placeholder="input promo discount % here *"
                                />
                                {errors.promo_discount && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.promo_discount}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <div
                                    className={`items-center overflow-hidden rounded border border-gray-500 bg-white text-sm text-gray-500 focus-within:ring-1 focus-within:ring-blue-500 lg:flex ${errors.promo_start ? 'border-red-500' : 'border-gray-500'}`}
                                >
                                    <div
                                        tabIndex="-1"
                                        className="select-none border-b border-r-0 border-gray-300 bg-gray-200 p-2 lg:min-w-[200px] lg:border-b-0 lg:border-r"
                                    >
                                        input promo start date *
                                    </div>
                                    <input
                                        type="datetime-local"
                                        name="promo_start"
                                        value={formData.promo_start}
                                        onChange={handleInputChange}
                                        className="w-full grow border-0 text-sm outline-none focus:outline-none focus:ring-0 lg:w-auto"
                                    />
                                </div>
                                {errors.promo_start && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.promo_start}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <div
                                    className={`items-center overflow-hidden rounded border border-gray-500 bg-white text-sm text-gray-500 focus-within:ring-1 focus-within:ring-blue-500 lg:flex ${errors.promo_end ? 'border-red-500' : 'border-gray-500'}`}
                                >
                                    <div
                                        tabIndex="-1"
                                        className="select-none border-b border-r-0 border-gray-300 bg-gray-200 p-2 lg:min-w-[200px] lg:border-b-0 lg:border-r"
                                    >
                                        input promo end date *
                                    </div>
                                    <input
                                        type="datetime-local"
                                        name="promo_end"
                                        value={formData.promo_end}
                                        onChange={handleInputChange}
                                        className="w-full grow border-0 text-sm outline-none focus:outline-none focus:ring-0 lg:w-auto"
                                    />
                                </div>
                                {errors.promo_end && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.promo_end}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <div
                                    className={`items-center overflow-hidden rounded border border-gray-500 bg-white text-sm text-gray-500 focus-within:ring-1 focus-within:ring-blue-500 lg:flex ${errors.visibility ? 'border-red-500' : 'border-gray-500'}`}
                                >
                                    <div
                                        tabIndex="-1"
                                        className="select-none border-b border-r-0 border-gray-300 bg-gray-200 p-2 lg:mr-2 lg:min-w-[200px] lg:border-b-0 lg:border-r"
                                    >
                                        select visibility
                                    </div>
                                    <div className="flex grow items-center space-x-6 p-2">
                                        <div>
                                            <input
                                                className="mr-2"
                                                type="radio"
                                                id="opt3"
                                                name="visibility"
                                                value="draft"
                                                checked={
                                                    formData.visibility ===
                                                    'draft'
                                                }
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="opt3">Draft</label>
                                        </div>
                                        <div>
                                            <input
                                                className="mr-2 active:ring-0"
                                                type="radio"
                                                id="opt1"
                                                name="visibility"
                                                checked={
                                                    formData.visibility ===
                                                    'visible'
                                                }
                                                value="visible"
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="opt1">
                                                Visible
                                            </label>
                                        </div>
                                        <div>
                                            <input
                                                className="mr-2"
                                                type="radio"
                                                id="opt2"
                                                name="visibility"
                                                value="hidden"
                                                checked={
                                                    formData.visibility ===
                                                    'hidden'
                                                }
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="opt2">Hidden</label>
                                        </div>
                                    </div>
                                </div>
                                {errors.visibililty && (
                                    <p className="py-1 text-xs text-red-500">
                                        {errors.visibililty}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <TagsInput
                                    className={`${errors.tags ? 'border-red-500' : 'border-gray-500'}`}
                                    value={tags}
                                    onTagsChange={handleTagsChange}
                                />
                                {errors.tags && (
                                    <div className="text-xs text-red-500">
                                        {errors.tags}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <h5 className="mt-6 py-0 font-medium text-gray-500">
                        Product Variants
                    </h5>

                    <hr className="mb-4 mt-1 border-r border-gray-400" />

                    <div className="mb-10 grid-cols-2 gap-x-6 gap-y-4 lg:grid">
                        {variants.map((variant, index) => (
                            <div key={variant.id} className="mb-4 lg:mb-0">
                                <VariantInput
                                    variant={variant}
                                    index={index}
                                    errors={formattedErrors['variants'][index]}
                                    onRemove={handleRemoveVariant}
                                    onValueChange={handleVariantChange}
                                />
                            </div>
                        ))}

                        <div
                            className="flex h-full min-h-44 w-full items-center justify-center border-4 border-dashed border-gray-300 bg-gray-100"
                            onClick={handleAddVariant}
                        >
                            <span className="text-2xl font-medium text-gray-300">
                                + Add Variant
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`rounded px-4 py-2 text-white active:bg-blue-700 ${processing ? 'bg-blue-200' : 'bg-blue-500'}`}
                        disabled={processing}
                    >
                        Edit Product
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default ProductEdit;
