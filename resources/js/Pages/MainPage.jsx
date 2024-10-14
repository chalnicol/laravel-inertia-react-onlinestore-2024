// ProductListing.jsx
import CategoryItem from '@/Components/CategoryItem';
import PaginationLinks from '@/Components/PaginationLinks';
import MainLayout from '@/Layouts/MainLayout';
import {
    setFilterApplied,
    setFilters,
    setViewMode,
} from '@/store/filtersSlice';
import { getPriceRange } from '@/utils/PromoUtils';
import { Head, router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MainPage = ({ products, filters }) => {
    const dispatch = useDispatch();

    const [filtersData, setFiltersData] = useState({
        categories: filters.categories
            ? filters.categories.split(',').map(Number)
            : [],
        brands: filters.brands ? filters.brands.split(',').map(Number) : [],
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || '',
        sortCriteria: filters.sortCriteria || 'date_desc',
        search: filters.search || '',
    });

    const { brands, categories, viewMode, filtersFetched, filterApplied } =
        useSelector((state) => state.filters);

    const [isLoaded, setIsLoaded] = useState(false);

    const fetchFilters = async () => {
        try {
            const response = await fetch('/get_filters');
            if (!response.ok) throw new Error('Failed to fetch filters');
            const data = await response.json();
            setIsLoaded(true);
            dispatch(setFilters(data)); // Dispatch the action to set filters
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const applyFilters = debounce((params) => {
        router.get(route('welcome'), params, {
            preserveState: true,
            replace: true,
            onFinish: () => {
                console.log('Filters applied');
                dispatch(setFilterApplied(false)); // Reset the filter applied flag
            },
            onError: () => {
                console.log('error applying filters..');
            },
        });
    }, 500);

    const handleFilterInputChange = (e) => {
        const { name, value } = e.target;

        dispatch(setFilterApplied(true));

        setFiltersData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handPriceRangeChange = (e) => {
        let { name, value } = e.target;

        setFiltersData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategoryFilterSelect = (id) => {
        dispatch(setFilterApplied(true));

        setFiltersData((prevData) => ({
            ...prevData,
            categories: prevData.categories.includes(id)
                ? prevData.categories.filter((categoryId) => categoryId !== id)
                : [...prevData.categories, id],
        }));
    };

    const handleBrandFilterSelect = (id) => {
        // dispatch(toggleBrandFilter(id));
        dispatch(setFilterApplied(true));

        setFiltersData((prevData) => ({
            ...prevData,
            brands: prevData.brands.includes(id)
                ? prevData.brands.filter((brandId) => brandId !== id)
                : [...prevData.brands, id],
        }));
    };

    const handleClearFilters = () => {
        dispatch(setFilterApplied(true));

        setFiltersData((prevData) => ({
            categories: [],
            brands: [],
            minPrice: '',
            maxPrice: '',
            sortCriteria: '',
            search: '',
        }));
    };

    const hasActiveFilters = useMemo(() => {
        return (
            filtersData.categories.length > 0 ||
            filtersData.brands.length > 0 ||
            filtersData.minPrice !== '' ||
            filtersData.maxPrice !== '' ||
            filtersData.search !== ''
        );
    }, [filtersData]);

    useEffect(() => {
        if (!filtersFetched) {
            fetchFilters();
            console.log('loaded');
        } else {
            setIsLoaded(true);
        }
    }, [filtersFetched, filters]);

    useEffect(() => {
        if (filterApplied) {
            const params = {};

            if (filtersData.categories.length > 0) {
                params['categories'] = filtersData.categories.join(',');
            }
            if (filtersData.brands.length > 0) {
                params['brands'] = filtersData.brands.join(',');
            }
            if (filtersData.minPrice) {
                params['minPrice'] = filtersData.minPrice;
            }
            if (filtersData.maxPrice) {
                params['maxPrice'] = filtersData.maxPrice;
            }
            if (filtersData.sortCriteria) {
                params['sortCriteria'] = filtersData.sortCriteria;
            }
            if (filtersData.search) {
                params['search'] = filtersData.search;
            }

            applyFilters(params);
        }
    }, [filterApplied, filtersData]);
    //..

    return (
        <MainLayout>
            <Head title="Welcome" />

            <div className="mx-auto max-w-7xl">
                <div className="items-center justify-center rounded-b bg-white text-3xl font-bold text-white">
                    {/* <p>Happy Shopping!</p> */}
                    <img
                        src={'/assets/logo.jpg'}
                        className="h-[200px] w-full object-cover"
                        alt=""
                    />
                </div>
                <div className="lg:flex">
                    <div className="hidden w-full overflow-auto px-4 lg:block lg:w-[18rem] lg:min-w-[18rem]">
                        {isLoaded ? (
                            <div className="mt-3 w-full lg:mt-[28px]">
                                <div className="mb-3 items-center justify-between md:flex">
                                    <h1 className="font-semibold">Filters</h1>
                                    {hasActiveFilters && (
                                        <button
                                            className="rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
                                            onClick={handleClearFilters}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div>
                                    {/* <p className="mb-2 text-sm font-semibold">
                                    Search
                                </p> */}
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="search product here"
                                        value={filtersData.search}
                                        onChange={handleFilterInputChange}
                                        className="w-full rounded border border-gray-400 bg-white py-1.5 text-sm shadow-inner focus:border-gray-500 focus:outline-none focus:ring-0"
                                    />
                                </div>
                                <div className="my-3">
                                    <p className="mb-2 text-sm font-semibold">
                                        Category
                                    </p>

                                    {/* {categories.map((category) => (
                                        <div key={category.id}>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filtersData.categories.includes(
                                                        category.id,
                                                    )}
                                                    onChange={() =>
                                                        handleCategoryFilterSelect(
                                                            category.id,
                                                        )
                                                    }
                                                    className="h-3 w-3 text-sky-700 focus:ring-sky-700"
                                                />
                                                <span className="ml-2 text-xs">
                                                    {category.name}
                                                </span>
                                            </label>
                                        </div>
                                    ))} */}

                                    {categories.map((category) => (
                                        <CategoryItem
                                            key={category.id}
                                            category={category}
                                        />
                                    ))}
                                </div>
                                <div className="my-3">
                                    <p className="mb-2 text-sm font-semibold">
                                        Brands
                                    </p>

                                    {brands.map((brand) => (
                                        <div key={brand.id}>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filtersData.brands.includes(
                                                        brand.id,
                                                    )}
                                                    onChange={() =>
                                                        handleBrandFilterSelect(
                                                            brand.id,
                                                        )
                                                    }
                                                    className="h-3 w-3 text-sky-700 focus:ring-sky-700"
                                                />
                                                <span className="ml-2 text-xs">
                                                    {brand.name}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="my-3">
                                    <p className="mb-3 text-sm font-semibold">
                                        Price Range
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            name="minPrice"
                                            value={filtersData.minPrice}
                                            placeholder="min"
                                            onChange={handPriceRangeChange}
                                            className="w-1/2 rounded text-xs xl:w-1/3"
                                        />
                                        <input
                                            type="text"
                                            name="maxPrice"
                                            value={filtersData.maxPrice}
                                            placeholder="max"
                                            onChange={handPriceRangeChange}
                                            className="w-1/2 rounded text-xs xl:w-1/3"
                                        />
                                        <button
                                            className="h-[34px] w-[30px] rounded bg-sky-700 text-white hover:bg-sky-600"
                                            onClick={() =>
                                                dispatch(setFilterApplied(true))
                                            }
                                        >
                                            <span className="material-symbols-outlined flex h-full items-center justify-center">
                                                arrow_right
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-5 w-full">
                                <span className="text-sm font-medium text-gray-500">
                                    Loading Filters..
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grow px-4 py-3">
                        <div className="mb-4 mt-2 gap-x-4 sm:flex sm:justify-center lg:justify-end">
                            <div className="mb-2 flex items-center gap-x-1 text-xs md:mb-0 md:mr-2">
                                <span className="w-20 sm:w-auto">Sort </span>

                                <select
                                    name="sortCriteria"
                                    value={filtersData.sortCriteria}
                                    onChange={handleFilterInputChange}
                                    className="w-40 rounded border px-2 py-1 text-xs"
                                >
                                    <option value="date_desc">
                                        Newest to Oldest
                                    </option>
                                    <option value="date_asc">
                                        Oldest to Newest
                                    </option>
                                    <option value="price_asc">
                                        Price Low to High
                                    </option>
                                    <option value="price_desc">
                                        Price High to Low
                                    </option>
                                    {/* <option value="rating_desc">
                                    Highest Rated
                                </option>
                                <option value="rating_asc">Lowest Rated</option> */}
                                </select>
                            </div>

                            <div className="mb-2 flex items-center gap-x-1 text-xs md:mb-0">
                                <span className="w-20 sm:w-auto">
                                    View Mode{' '}
                                </span>

                                <button
                                    onClick={() =>
                                        dispatch(setViewMode('grid'))
                                    }
                                    className={`rounded border border-gray-500 px-2 py-1 ${viewMode === 'grid' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}`}
                                    disabled={viewMode === 'grid'}
                                >
                                    Grid View
                                </button>

                                <button
                                    onClick={() =>
                                        dispatch(setViewMode('list'))
                                    }
                                    className={`rounded border border-gray-500 px-2 py-1 ${viewMode === 'list' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}`}
                                    disabled={viewMode === 'list'}
                                >
                                    List View
                                </button>
                            </div>
                        </div>

                        <div
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-x-1 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                    : 'flex flex-col'
                            }
                        >
                            {products.data.map((product) =>
                                viewMode === 'grid' ? (
                                    <div
                                        key={product.id}
                                        className="relative mx-auto flex min-h-[280px] w-[80%] flex-col rounded border border-gray-300 bg-white p-3 transition duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg sm:mx-0 sm:w-full"
                                        onClick={() =>
                                            router.visit(
                                                route('product.show', {
                                                    id: product.id,
                                                }),
                                            )
                                        }
                                    >
                                        <div className="grow">
                                            <img
                                                src={
                                                    product.image
                                                        ? '/storage/' +
                                                          product.image
                                                        : '/assets/noimage.png'
                                                }
                                                alt={product.name}
                                                className="mb-3 h-40 w-full border border-gray-300 bg-gray-100 object-cover"
                                            />
                                            <h3 className="text-sm font-medium">
                                                {product.name}
                                            </h3>

                                            {product.variants &&
                                            product.variants.length > 0 ? (
                                                <div className="text-orange-600">
                                                    <span>
                                                        ₱
                                                        {
                                                            getPriceRange(
                                                                product.variants,
                                                                product.is_promo,
                                                            ).min
                                                        }
                                                    </span>
                                                    <span> - </span>
                                                    <span>
                                                        ₱
                                                        {
                                                            getPriceRange(
                                                                product.variants,
                                                                product.is_promo,
                                                            ).max
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="text-orange-600">
                                                    <span>
                                                        ₱{product.selling_price}
                                                    </span>
                                                </div>
                                            )}

                                            {product.is_promo && (
                                                <div className="mt-1 text-xs text-gray-700">
                                                    {product.variants &&
                                                    product.variants.length >
                                                        0 ? (
                                                        <span className="line-through">
                                                            ₱
                                                            {
                                                                getPriceRange(
                                                                    product.variants,
                                                                ).min
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="line-through">
                                                            {product.base_price}
                                                        </span>
                                                    )}
                                                    <span className="ml-2 font-medium">
                                                        {product.promo_discount}
                                                        %{' '}
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <span className="text-xs text-gray-600">
                                                    {product.brand.name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-600">
                                                    {product.category.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={product.id}
                                        className="mb-2 rounded border border-gray-200 bg-white p-3 transition duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg"
                                        onClick={() =>
                                            router.visit(
                                                route('product.show', {
                                                    id: product.id,
                                                }),
                                            )
                                        }
                                    >
                                        <div className="flex">
                                            <img
                                                src={
                                                    product.image
                                                        ? '/storage/' +
                                                          product.image
                                                        : '/assets/noimage.png'
                                                }
                                                alt={product.name}
                                                className="h-20 w-20 min-w-20 border border-gray-400 bg-gray-100 object-cover lg:w-32 lg:min-w-32"
                                            />
                                            <div className="ml-4 grow">
                                                <h3 className="text-sm font-medium">
                                                    {product.name}
                                                </h3>

                                                {product.variants &&
                                                product.variants.length > 0 ? (
                                                    <div className="mt-1 text-sm text-orange-600">
                                                        <span>
                                                            ₱
                                                            {
                                                                getPriceRange(
                                                                    product.variants,
                                                                    product.is_promo,
                                                                ).min
                                                            }
                                                        </span>
                                                        <span> - </span>
                                                        <span>
                                                            ₱
                                                            {
                                                                getPriceRange(
                                                                    product.variants,
                                                                    product.is_promo,
                                                                ).max
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="mt-1 text-sm text-orange-600">
                                                        <span>
                                                            ₱
                                                            {
                                                                product.selling_price
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                {product.is_promo && (
                                                    <div className="mt-1 text-sm text-gray-700">
                                                        {product.variants &&
                                                        product.variants
                                                            .length > 0 ? (
                                                            <span className="line-through">
                                                                ₱
                                                                {
                                                                    getPriceRange(
                                                                        product.variants,
                                                                    ).min
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="line-through">
                                                                {
                                                                    product.base_price
                                                                }
                                                            </span>
                                                        )}
                                                        <span className="ml-2 font-medium">
                                                            {
                                                                product.promo_discount
                                                            }
                                                            %{' '}
                                                        </span>
                                                    </div>
                                                )}

                                                <p className="mt-1 text-xs text-gray-600">
                                                    {product.brand.name +
                                                        ' / ' +
                                                        product.category.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        {products.data.length === 0 && (
                            <div className="flex min-h-[500px] items-center justify-center rounded border border-gray-500 bg-gray-200 text-2xl font-semibold text-gray-500">
                                No product found
                            </div>
                        )}

                        <PaginationLinks
                            className="my-6"
                            color="sky"
                            meta={products.meta}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MainPage;
