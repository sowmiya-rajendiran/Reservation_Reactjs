import { restaurantAPI } from "../instances/endpoint";

const AllRestaurantLoader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const searchParams = Object.fromEntries(url.searchParams);
        const response = await restaurantAPI.getRestaurants(searchParams);
        return {
            restaurants: response.data.data || [],
            pagination: {
                page: response.data.page || 1,
                limit: response.data.limit || 10,
                total: response.data.total || 0,
                pages: response.data.pages || 0,
            }
        };
    } catch (error) {
        return {
            restaurants: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0,
            },
        };
    }
};

export default AllRestaurantLoader;