// ProductDetail.jsx
import Loader from '@/Components/Loader';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import FlashMessage from '@/Components/FlashMessage';
import { useDispatch } from 'react-redux';

const ProductDetail = ({ product, flash, errors }) => {
    const dispatch = useDispatch();
    const [processing, setProcessing] = useState(false);
    const [cartItem, setCartItem] = useState({
        id: product.data.id,
        name: product.data.name,
        quantity: 1,
        purchase_price:
            product.data.variants.length > 0
                ? product.data.variants[0].variant_selling_price
                : product.data.selling_price,
        variant: product.data.variants.length ? product.data.variants[0] : null,
    });

    // console.log(errors);

    const handleAddToCart = () => {
        setProcessing(true);
        router.post(route('cart.add'), cartItem, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                // dispatch(addItemToCart(cartItem));
            },
            onError: (error) => {
                console.log('Error adding to cart :', error);
            },
            onFinish: () => {
                setProcessing(false);
                setCartItem((prevOrder) => ({
                    ...prevOrder,
                    quantity: 1,
                }));
            },
        });
    };

    const handleCheckout = () => {
        // Implement add to cart logic
    };
    const handleQuantityChange = (mode) => {
        setCartItem((prevOrder) => ({
            ...prevOrder,
            quantity:
                mode === 'add'
                    ? prevOrder.quantity + 1
                    : Math.max(prevOrder.quantity - 1, 1),
        }));
    };
    const handleQuantityInputChange = (e) => {
        setCartItem((prevOrder) => ({
            ...prevOrder,
            quantity: Math.max(e.target.value, 1),
        }));
    };

    const handleVariantSelect = (variant) => {
        setCartItem((prevOrder) => ({
            ...prevOrder,
            variant: variant,
            purchase_price: variant.variant_selling_price,
        }));
    };

    return (
        <MainLayout>
            <Head title="Product Detail" />
            <div className="mx-auto w-full max-w-7xl">
                <FlashMessage flash={flash} />

                <div className="w-full py-6 lg:flex">
                    <div className="mb-6 grow gap-6 px-4 md:flex lg:mb-0">
                        <img
                            src={
                                product.data.image
                                    ? '/storage/' + product.data.image
                                    : '/assets/noimage.png'
                            }
                            alt={product.data.name}
                            className="mx-auto max-h-[250px] w-full border border-gray-400 bg-gray-100 object-cover md:w-[210px] md:min-w-[250px]"
                        />

                        <div className="mt-4 flex grow flex-col md:mt-0">
                            <div className="mb-6">
                                <h2 className="mb-1 text-xl font-semibold">
                                    {product.data.name}
                                </h2>
                                <p className="mb-2 text-sm leading-normal text-gray-600">
                                    {product.data.description}
                                </p>

                                <p className="mb-1 text-3xl font-medium text-orange-500">
                                    ₱{cartItem.purchase_price}
                                </p>

                                {product.data.is_promo && (
                                    <div className="text-sm font-medium">
                                        <span className="text-gray-500 line-through">
                                            {product.data.variants &&
                                            product.data.variants.length > 0 ? (
                                                <span>
                                                    ₱
                                                    {
                                                        cartItem.variant
                                                            .variant_base_price
                                                    }
                                                </span>
                                            ) : (
                                                <span>
                                                    ₱{product.data.base_price}
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-500-600 ml-2">
                                            -{product.data.promo_discount}%
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mb-1 flex items-center gap-3 text-sm text-gray-600">
                                <span className="w-24 py-1 font-medium text-gray-700">
                                    Rating
                                </span>
                                <div className="flex">
                                    <span className="material-symbols-outlined text-xl">
                                        star_rate
                                    </span>
                                    <span className="material-symbols-outlined text-xl">
                                        star_rate
                                    </span>
                                    <span className="material-symbols-outlined text-xl">
                                        star_rate
                                    </span>
                                    <span className="material-symbols-outlined text-xl">
                                        star_rate
                                    </span>
                                    <span className="material-symbols-outlined text-xl">
                                        star_rate_half
                                    </span>
                                </div>
                            </div>

                            {/* { product.data.promo_discount && (
                                    <div className="text-sm mb-1 text-gray-600 flex items-center gap-3">
                                        <span className="font-medium text-gray-700 w-24 py-1">Promo</span>
                                        <span className="py-1 font-medium text-gray-500">
                                        { formatDate ( product.data.promo_start) + " - " + formatDate ( product.data.promo_end )}
                                        </span>
                                    </div>
                                )} */}

                            {/* brand.. */}
                            <div className="mb-1 flex items-center gap-3 text-sm text-gray-600">
                                <span className="w-24 py-1 font-medium text-gray-700">
                                    Brands
                                </span>
                                <span className="py-1">
                                    {product.data.brand
                                        ? product.data.brand.name
                                        : ''}
                                </span>
                            </div>

                            {/* variants */}
                            {product.data.variants &&
                                product.data.variants.length > 0 && (
                                    <div className="mb-1 flex items-start gap-3 text-sm text-gray-600">
                                        <span className="w-24 py-1 font-medium text-gray-700">
                                            Variant
                                        </span>
                                        <div>
                                            <div className="py-1">
                                                {cartItem.variant
                                                    ? cartItem.variant
                                                          .variant_name
                                                    : ''}
                                            </div>

                                            <div className="mt-2 grid grid-cols-5 gap-x-2 gap-y-1">
                                                {product.data.variants.map(
                                                    (variant) => (
                                                        <img
                                                            key={variant.id}
                                                            id={variant.id}
                                                            className={`mb-1 h-10 w-12 cursor-pointer border object-cover transition duration-300 ease-out ${cartItem.variant.id === variant.id ? 'border-orange-600 shadow-md' : 'border-gray-500'}`}
                                                            src={
                                                                variant.image
                                                                    ? `/storage/${variant.image}`
                                                                    : '/assets/noimage.png'
                                                            }
                                                            alt={variant.name}
                                                            onClick={() =>
                                                                handleVariantSelect(
                                                                    variant,
                                                                )
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* quantity */}
                            <div className="my-3 flex items-center gap-3 text-sm text-gray-600">
                                <span className="w-24 py-1 font-medium text-gray-700">
                                    Quantity
                                </span>
                                <div className="flex items-center">
                                    <button
                                        className="h-8 w-10 rounded-l bg-gray-300"
                                        onClick={() =>
                                            handleQuantityChange('subtract')
                                        }
                                    >
                                        -
                                    </button>

                                    <input
                                        type="text"
                                        id="quantity"
                                        name="quantity"
                                        value={cartItem.quantity}
                                        className="h-8 w-20 border border-gray-300"
                                        onChange={handleQuantityInputChange}
                                    />

                                    <button
                                        className="h-8 w-10 rounded-r bg-gray-300"
                                        onClick={() =>
                                            handleQuantityChange('add')
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="my-5 flex w-full gap-3">
                                <button
                                    className="w-1/2 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 xl:w-1/3"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="w-1/2 rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 xl:w-1/3"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full px-4 lg:w-[320px] lg:min-w-[320px]">
                        <h6 className="mb-3 text-sm font-semibold text-gray-800">
                            Delivery Options
                        </h6>
                        <div className="mb-2 flex gap-2 text-sm leading-normal">
                            <span className="material-symbols-outlined">
                                location_on
                            </span>

                            <p className="text-xs">
                                B12 L32 Resurrection St. Sacred Heart Village,
                                QC
                            </p>
                        </div>

                        <hr className="my-3 border-gray-300" />

                        <div className="mb-2 flex gap-2 text-sm leading-normal">
                            <span className="material-symbols-outlined">
                                local_shipping
                            </span>
                            <div>
                                <h6 className="mb-1 text-sm font-semibold">
                                    Priority Delivery (1-2 Hours)
                                </h6>
                                <p className="text-justify text-xs leading-normal">
                                    Guaranteed delivery within 1-2 hours for
                                    orders placed before 7:00 PM within a 2km
                                    radius. Orders placed after 7:00 PM will be
                                    delivered the next day, starting at 8:00 AM.
                                    If the delivery is late, you will receive a
                                    ₱10 voucher
                                </p>
                            </div>
                        </div>

                        <hr className="my-3 border-gray-300" />

                        <div className="mb-2 flex gap-2 text-sm leading-normal">
                            <span className="material-symbols-outlined">
                                store
                            </span>
                            <p className="leading-normal">
                                <span className="font-semibold">
                                    Cash on Delivery
                                </span>
                                <span className="ml-1 text-xs">
                                    is available for orders below ₱200.
                                </span>
                            </p>
                        </div>

                        <hr className="my-3 border-gray-300" />

                        <h6 className="mb-3 text-sm font-semibold text-gray-600">
                            Return and Warranty
                        </h6>

                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                    check
                                </span>
                                <span>100% Authentic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                    psychology_alt
                                </span>
                                <span>Change of mind returns</span>
                            </div>
                            {/* <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">
                                    package
                                    </span>
                                    <span>2 Days Free Returns</span>
                                    
                                </div> */}
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                    shield_question
                                </span>
                                <span>Warranty not available</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-14 mt-14 px-4">
                    <h1 className="flex w-36 items-center justify-center bg-sky-800 py-2 text-white">
                        Reviews (0)
                    </h1>
                    <hr className="mb-2 border-b border-gray-300" />
                    <p className="py-2">There are no reviews yet.</p>
                    <p className="mt-1 text-sm text-gray-700">
                        Only logged in customers who have purchased this product
                        may leave a review.
                    </p>
                </div>
            </div>
            {processing && <Loader />}
        </MainLayout>
    );
};

export default ProductDetail;
