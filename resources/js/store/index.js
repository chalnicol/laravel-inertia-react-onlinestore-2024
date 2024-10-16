// resources/js/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import filtersReducer from './filtersSlice';
import productsReducer from './productSlice';

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        products: productsReducer,
        cart: cartReducer,
    },
});
