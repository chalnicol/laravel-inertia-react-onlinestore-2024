import { createSlice } from '@reduxjs/toolkit';

// Initial state for the cart
const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Set the entire cart (for example, after fetching from the session)
        addItemToCart: (state, action) => {
            const { id, name, purchase_price, quantity, variant } =
                action.payload;

            // Check if the item (and variant if any) already exists in the cart
            const existingItem = state.items.find(
                (item) =>
                    item.id === id &&
                    (!variant ||
                        (item.variant && item.variant.id === variant.id)),
            );

            if (existingItem) {
                // If item exists, update the quantity
                existingItem.quantity += quantity;
            } else {
                // Otherwise, add the new item to the cart
                state.items.push(action.payload);
            }
        },
        // Add or update an item in the cart
        updateCartItem: (state, action) => {
            const { itemId, newQuantity } = action.payload;
            state.items = state.items.map((item) => {
                if (item.id === itemId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        },
        // Remove an item from the cart
        removeCartItems: (state, action) => {
            const idsToRemove = action.payload;
            state.items = state.items.filter(
                (item) => !idsToRemove.includes(item.id),
            );
        },
    },
});

// Selector to get total cart items (sum of quantities)
export const selectCartItemCount = (state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Export actions and reducer
export const { addItemToCart, updateCartItem, removeCartItems } =
    cartSlice.actions;
export default cartSlice.reducer;
