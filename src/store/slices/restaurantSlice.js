import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    all: [],
    restaurants: [],
    restaurant: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
    filters: {
        search: '',
        cuisine: '',
        location: '',
        priceRange: '',
        dietaryRestrictions: '',
        features: '',
    },
};

const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        fetchRestaurantsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchRestaurantsSuccess: (state, action) => {
            state.loading = false;
            state.restaurants = action.payload.data;
            state.pagination = {
                total: action.payload.total,
                page: action.payload.page,
                pages: action.payload.pages,
                count: action.payload.count,
            };
            state.error = null;
        },
        fetchRestaurantsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        fetchRestaurantStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchRestaurantSuccess: (state, action) => {
            state.loading = false;
            state.restaurant = action.payload;
            state.error = null;
        },
        fetchRestaurantFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    fetchRestaurantsStart,
    fetchRestaurantsSuccess,
    fetchRestaurantsFailure,
    fetchRestaurantStart,
    fetchRestaurantSuccess,
    fetchRestaurantFailure,
    setFilters,
    clearFilters,
    clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;