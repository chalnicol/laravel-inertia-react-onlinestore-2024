import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
    name: 'filters',
    initialState: {
        // searchTerm: '', // Search term for filtering products
        // filtersFetched: false, // Whether filters have been fetched
        // minPrice: null, // Add minPrice to state
        // maxPrice: null, // Add maxPrice to state
        // sortCriteria: 'created_at', // default sorting
        filterApplied: false, //
        viewMode: 'grid', // default view mode
        brands: [], // List of brands, each with { id, name, selected }
        categories: [], // List of categories, each with { id, name, selected }
    },
    reducers: {
        setFilters: (state, action) => {
            const { brands, categories } = action.payload;
            // state.brands = brands.map((brand) => ({
            //     ...brand,
            //     selected: false,
            // }));
            // state.categories = categories.map((category) => ({
            //     ...category,
            //     selected: false,
            // }));
            (state.brands = brands), (state.categories = categories);
            state.filtersFetched = true;
        },
        setViewMode(state, action) {
            state.viewMode = action.payload;
        },
        setFilterApplied: (state, action) => {
            state.filterApplied = action.payload;
        },
        // toggleBrandFilter: (state, action) => {
        //     const brandId = action.payload;
        //     const brand = state.brands.find((b) => b.id === brandId);
        //     if (brand) brand.selected = !brand.selected;
        // },
        // toggleCategoryFilter: (state, action) => {
        //     const categoryId = action.payload;
        //     const category = state.categories.find((c) => c.id === categoryId);
        //     if (category) category.selected = !category.selected;
        // },
        // setPriceRange: (state, action) => {
        //     const { minPrice, maxPrice } = action.payload; // Set new price range
        //     state.minPrice = minPrice;
        //     state.maxPrice = maxPrice;
        // },
        // setSearchTerm: (state, action) => {
        //     state.searchTerm = action.payload;
        // },
        // Set view mode

        // setSortCriteria(state, action) {
        //     state.sortCriteria = action.payload;
        // },
    },
});

export const {
    setFilters,
    setViewMode,
    setFilterApplied,

    // toggleBrandFilter,
    // toggleCategoryFilter,
    // setPriceRange,
    // setSortCriteria,
    // setSearchTerm,
} = filtersSlice.actions;

export default filtersSlice.reducer;
