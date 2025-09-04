import { restaurantAPI } from "../instances/endpoint";

const RestaurantLoader = async ({ request }) => {
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
        return { restaurant: null };
    }

    try {
        const res = await restaurantAPI.getRestaurant(id);
        return {
            restaurant: res.data || null,
        };
    } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        return { restaurant: null };
    }
};

export default RestaurantLoader;