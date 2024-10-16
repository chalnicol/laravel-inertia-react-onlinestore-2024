// store/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        data: [],
        lastPage: 0,
        hasMore: true,
    },
    reducers: {
        appendProducts: (state, action) => {
            state.data = [...state.data, ...action.payload.products];
            state.lastPage = action.payload.lastPage;
            state.hasMore = action.payload.hasMore;
        },
        resetProducts: (state, action) => {
            state.data = [];
            state.lastPage = 0;
            state.hasMore = true;
        },
        // initializeProducts: (state, action) => {
        //     state.data = action.payload.products;
        //     state.lastPage = action.payload.lastPage;
        //     state.hasMore = action.payload.hasMore;
        //     state.initialized = true; // Mark as initialized
        // },
    },
});

export const { appendProducts, resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
