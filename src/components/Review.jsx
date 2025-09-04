import { useEffect, useState } from "react";
import { reviewAPI } from "../instances/endpoint";
import NoImage from "../assets/No_Image_Available.jpg";

const RestaurantReviews = ({ restaurantId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await reviewAPI.getReviews(restaurantId);
                if (res.data.success) {
                    setReviews(res.data.reviews);
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };

        if (restaurantId) fetchReviews();
    }, [restaurantId]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="space-y-6 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-[25px] gap-[10px]">
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                reviews.map((r) => (
                <div key={r._id} className="p-4  shadow-sm ">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold">{r.user?.name || "Anonymous"}</p>
                        <p className="text-sm text-gray-500">{formatDate(r.createdAt)}</p>
                    </div>
                    <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < Math.round(r.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                        ))}
                        <span className="ml-2 text-gray-600">{r.rating.toFixed(1)}</span>
                    </div>
                    <p className="mb-2">{r.comment}</p>
                    {r.photos?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                        {r.photos.map((photo, i) => (
                        <img
                            key={i}
                            src={`http://localhost:3005/uploads/${r.photos[i]}`}
                            alt="review"
                            className="w-24 h-24 object-cover rounded"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = NoImage;
                            }}
                            />
                        ))}
                    </div>
                    )}
                </div>
                ))
            )}
        </div>
    );
};

export default RestaurantReviews;