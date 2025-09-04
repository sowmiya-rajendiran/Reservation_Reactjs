import { useEffect, useState } from "react";
import { restaurantAPI } from "../instances/endpoint";
import RestaurantDisplay from "./RestaurantDisplay";

const Recommendations = () => {
    const [allTrending, setAllTrending] = useState([]);
    const [trending, setTrending] = useState([]);

    const shuffleRestaurants = (list) => {
        const shuffled = [...list].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await restaurantAPI.getTrending();
                if (res.data.trending) {
                    setAllTrending(res.data.trending);
                    setTrending(shuffleRestaurants(res.data.trending));
                }
            } catch (error) {
                console.error("Error loading recommendations", error);
            }
        };

        fetchData();
    }, []);

    const handleReserve = () => {
        if (allTrending.length > 0) {
            setTrending(shuffleRestaurants(allTrending)); 
        }
    };

    return (
        <div>
            {trending.length === 0 ? (
                <p>No trending restaurants right now.</p>
            ) : (
                <div>
                    <div className="grid xl:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-[35px]">
                        {trending.map((restaurant) => (
                            <RestaurantDisplay
                                key={restaurant._id}
                                restaurant={restaurant}
                                onReserve={handleReserve} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recommendations;