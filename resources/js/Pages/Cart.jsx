import Loader from '@/Components/Loader';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useState } from 'react';

const Cart = ({ items, flash, errors, cartCount, summary = {} }) => {
    const [itemsSelected, setItemsSelected] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleSelectAllChange = () => {
        const newItems =
            itemsSelected.length != items.length
                ? items.map((item) => item.id)
                : [];

        setItemsSelected(newItems);

        calculateSummary(newItems);
    };

    const toggleItemsSelected = (id) => {
        const newItems = itemsSelected.includes(id)
            ? itemsSelected.filter((item) => item.id === id)
            : [...itemsSelected, id];
        // if (itemsSelected.includes(id)) {
        //     setItemsSelected((prevData) =>
        //         prevData.filter((itemId) => itemId !== id),
        //     );
        // } else {
        //     setItemsSelected((prevData) => [...prevData, id]);
        // }

        calculateSummary(newItems);

        setItemsSelected(newItems);
    };

    const handleDeleteSelectedClick = () => {
        removeCartItems(itemsSelected);
    };

    const handleDeleteItemClick = (itemId) => {
        removeCartItems([itemId]);
    };

    const removeCartItems = (items) => {
        setItemsSelected([]);
        setProcessing(true);
        router.post(
            route('cart.remove'),
            { ids: items },
            {
                preserveState: true,
                replace: true,
                onFinish: () => {
                    //..
                    setProcessing(false);
                    console.log('Finished');
                },
                onError: (err) => {
                    console.log('Failed to remove items from cart');
                },
            },
        );
    };

    const updateCartItem = debounce((itemId, newQuantity) => {
        if (newQuantity > 0) {
            setItemsSelected([]);
            setProcessing(true);

            router.post(
                route('cart.update'),
                { id: itemId, quantity: newQuantity },
                {
                    preserveState: true,
                    replace: true,
                    onFinish: () => {
                        //..
                        setProcessing(false);
                    },
                    onError: (err) => {
                        console.log('Failed to update quantity in cart');
                    },
                },
            );
        }
    }, 500);

    const calculateSummary = debounce((ids) => {
        setProcessing(true);

        router.get(
            route('cart.index'),
            { selected_items: ids },
            {
                preserveState: true,
                replace: true,
                onFinish: () => {
                    //..
                    setProcessing(false);
                },
                onError: (err) => {
                    console.log('Failed to update calculate summary');
                },
            },
        );
    }, 500);

    return (
        <MainLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Cart
                </h2>
            }
        >
            <Head title="Home" />

            <div className="mx-auto max-w-7xl px-4">
                <div className="my-6 gap-6 lg:flex">
                    <div className="grow">
                        {items.length > 0 && (
                            <>
                                <div className="mb-2 flex w-full items-center justify-between gap-3 rounded bg-white p-3 text-sm shadow">
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="select_all"
                                            id="select_all"
                                            className="h-4 w-4 text-sky-500"
                                            checked={
                                                itemsSelected.length ===
                                                items.length
                                            }
                                            onChange={handleSelectAllChange}
                                        />
                                        <label
                                            htmlFor="select_all"
                                            className="ml-3 font-medium text-gray-500"
                                        >
                                            Select All ({cartCount}{' '}
                                            {items.length > 1
                                                ? 'items'
                                                : 'item'}
                                            )
                                        </label>
                                    </div>

                                    <button
                                        className="rounded bg-red-500 px-3 py-1 text-gray-100"
                                        onClick={handleDeleteSelectedClick}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="my-2 flex items-center gap-3 rounded bg-white px-3 py-5 shadow md:py-3"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-sky-500"
                                            checked={itemsSelected.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                toggleItemsSelected(item.id)
                                            }
                                        />
                                        <div className="flex w-full flex-col justify-between gap-3 md:flex-row md:gap-2">
                                            <div className="flex gap-3">
                                                <img
                                                    src="/assets/noimage.png"
                                                    alt="image"
                                                    className="h-20 w-20 border border-gray-300 object-cover"
                                                />
                                                <div className="font-medium text-gray-500">
                                                    <Link
                                                        href={route(
                                                            'product.show',
                                                            { id: item.id },
                                                        )}
                                                        className="hover:text-gray-400"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    {item.variant && (
                                                        <p className="my-1 text-xs">
                                                            {
                                                                item.variant
                                                                    .variant_name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg text-orange-600">
                                                    ₱{item.purchase_price}
                                                </p>
                                                <button
                                                    className="flex w-full items-center text-xs text-red-500 hover:text-red-300"
                                                    onClick={() =>
                                                        handleDeleteItemClick(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <span className="material-symbols-outlined mr-1 text-lg">
                                                        delete
                                                    </span>
                                                    Remove Item
                                                </button>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="h-8 md:px-2">
                                                    <button
                                                        className="h-full w-8 rounded-l bg-sky-600 font-medium text-white"
                                                        onClick={() =>
                                                            updateCartItem(
                                                                item.id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateCartItem(
                                                                item.id,
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ) || 1,
                                                            )
                                                        }
                                                        className="h-full w-16 border border-gray-300"
                                                    />
                                                    <button
                                                        className="h-full w-8 rounded-r bg-sky-600 font-medium text-white"
                                                        onClick={() =>
                                                            updateCartItem(
                                                                item.id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {items.length === 0 && (
                            <p className="text-gray-400">
                                Your shopping cart is empty.
                            </p>
                        )}
                    </div>

                    <div className="my-5 lg:my-0 lg:w-1/3">
                        <div className="w-full rounded bg-white p-3 shadow">
                            <h3 className="text-lg font-semibold">
                                Order Summary
                            </h3>

                            <div className="my-2 flex w-full gap-2">
                                <div>
                                    Subtotal ({summary.totalItems || '0'} items)
                                </div>
                                <div className="grow text-right">
                                    ₱
                                    {summary.subTotal !== 0
                                        ? summary.subTotal.toLocaleString()
                                        : '0.00'}
                                </div>
                            </div>
                            <div className="my-2 flex w-full gap-2">
                                <div>Shipping Fee</div>
                                <div className="grow text-right">₱0.00</div>
                            </div>

                            <hr className="my-2 border-b border-gray-300" />
                            <div className="my-2 flex w-full gap-2 font-medium text-orange-600">
                                <div>Subtotal</div>
                                <div className="grow text-right">
                                    ₱
                                    {summary.subTotal !== 0
                                        ? summary.subTotal.toLocaleString()
                                        : '0.00'}
                                </div>
                            </div>

                            <button className="mt-2 w-full rounded bg-sky-500 px-4 py-2 font-medium text-white hover:bg-sky-600">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {processing && <Loader />}
        </MainLayout>
    );
};

export default Cart;
