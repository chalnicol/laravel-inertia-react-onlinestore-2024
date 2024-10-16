import MainLayout from '@/Layouts/MainLayout';
import { appendProducts, resetProducts } from '@/store/productSlice';
import { Head, router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Welcome = () => {
    const productsListing = usePage().props.products;
    const dispatch = useDispatch();

    const {
        data: products,
        lastPage,
        hasMore,
    } = useSelector((state) => state.products);

    const [initialized, setInitialized] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {});
    // Only initialize products if they have not been initialized before (e.g., when navigating back to this page)
    useEffect(() => {
        if (productsListing.meta.current_page === lastPage + 1) {
            dispatch(
                appendProducts({
                    products: productsListing.data,
                    lastPage: productsListing.meta.current_page,
                    hasMore:
                        productsListing.meta.current_page <
                        productsListing.meta.last_page,
                }),
            );
        }

        if (productsListing.meta.current_page > 1 && lastPage === 0) {
            // redirect();
            dispatch(resetProducts());
        }
        // if ( productsListing.meta.current_page )
    }, [productsListing, lastPage, dispatch]);

    const loadProducts = debounce(() => {
        if (loading || !hasMore) return;

        router.get(
            route('welcome'),
            { page: lastPage + 1 },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    }, 500);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            const scrollProgress = (scrollTop + clientHeight) / scrollHeight;

            if (scrollProgress > 0.8 && !loading && hasMore) {
                loadProducts();
                setLoading(true);

                window.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth', // This will ensure smooth scrolling after products are loaded
                });
            }
        };

        window.addEventListener('scroll', handleScroll);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    return (
        <>
            <Head title="Welcome" />
            <MainLayout>
                <div className="mx-auto max-w-7xl px-4 xl:px-0">
                    <div className="relative h-56 overflow-hidden">
                        <img
                            src={'/assets/logo.jpg'}
                            className="h-full w-full object-cover"
                            alt="background"
                        />
                    </div>
                    <div className="my-2 flex xl:px-0">
                        <input
                            type="search"
                            placeholder="search here..."
                            className="grow rounded-l border-r-0 border-gray-400 px-4 py-2"
                        />
                        <button className="w-24 rounded-r bg-sky-700 p-2 text-white hover:bg-sky-800">
                            Search
                        </button>
                    </div>

                    <div className="my-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:px-0">
                        {products.map((product) => (
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
                                                ? '/storage/' + product.image
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
                                            product.variants.length > 0 ? (
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
                                                {product.promo_discount}%{' '}
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
                        ))}
                    </div>

                    {!hasMore && (
                        <p className="mb-5 rounded-full border border-gray-500 bg-gray-500 px-3 py-0.5 text-center text-sm font-medium text-gray-500 text-white">
                            No more products to load.
                        </p>
                    )}
                    {loading && (
                        <p className="mb-5 rounded-full border border-gray-500 bg-gray-500 px-3 py-0.5 text-center text-sm font-medium text-gray-500 text-white">
                            Loading more products...
                        </p>
                    )}
                </div>
            </MainLayout>
        </>
    );
};

export default Welcome;
