import { useLoaderData } from "react-router";
import NoImage from "../assets/No_Image_Available.jpg";
import Recommendations from "./Recommendation";
import RestaurantReviews from "./Review";
import BookTableModal from "./BookTableModel";
import { useState } from "react";
import { reservationAPI } from "../instances/endpoint";
import toast from "react-hot-toast";

function RestaurantDetails() {
    const { restaurant } = useLoaderData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!restaurant) {
        return (
            <div className="text-center mt-10 text-red-500 text-lg">
                Restaurant not found
            </div>
        );
    }

    const isLoggedIn = !!localStorage.getItem("token");

    const { name, cuisine, priceRange, location, contact, openingHours, menu, photos, tableCapacity, rating , _id } = restaurant;

    const handleBookTable = async (formData) => {
    try {
        const response = await reservationAPI.createReservation({
        restaurantId: _id, 
        ...formData,
        });
        
        console.log("Reservation confirmed:", response.data);
        toast("Table booked successfully!");
    } catch (error) {
        console.error("Booking failed:", error.response?.data || error.message);
        toast("Failed to book table!");
    }
    };

    return (
        <div>
            <div className="sticky top-0 md:px-[100px] px-[25px] py-[25px] flex justify-between items-center bg-black shadow-lg">
                <h1 className="sm:text-[15px] text-[20px] font-semibold text-white">
                    {name}
                </h1>
            </div>
            <div className="lg:px-[100px] md:px-[50px] px-[25px] py-[50px]">
                {photos?.length > 0 && (
                    <div className="grid md:grid-cols-2  grid-cols-1 gap-4 mb-6">
                        {photos.map((photo, idx) => (
                            <img
                                key={idx}
                                // src={photo}
                                src={`http://localhost:3005${photo}`}
                                // src={`https://reservation-nodejs.onrender.com${photo}`}
                                alt={name}
                                className="rounded-lg shadow-md w-full md:h-100 h-70 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = NoImage;
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Basic Info */}
                <div className="md:flex justify-between">
                    <div>
                        <h1 className="md:text-3xl text-[19px] font-bold mb-2">{name}</h1>
                        <p className="text-gray-600">{cuisine} • {priceRange}</p>
                        <p className="text-gray-500 mb-4">Table Capacity: {tableCapacity}</p>
                        <p className="text-yellow-500 font-semibold">Rating : {rating || "No ratings yet"} ⭐</p>
                    </div>
                    <div>
                        <button 
                        className="md:text-[18px] text-[16px] font-semibold bg-black text-white px-[45px] py-[13px] rounded cursor-pointer md:mt-0 mt-[20px]"
                        onClick={() => {
                            if (!isLoggedIn) return toast.error("Please login to book a table!");
                            setIsModalOpen(true);
                        }}
                        >Book a Table</button>

                        <BookTableModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleBookTable}
                            restaurant={restaurant}
                        />
                    </div>
                </div>
                

                {/* Location */}
                <div className="mt-6">
                    <h2 className="md:text-xl  text-[19px] font-semibold">Location</h2>
                    <p>{location?.address}, {location?.city}, {location?.state} - {location?.postalCode}</p>
                </div>

                {/* Contact */}
                <div className="mt-6">
                    <h2 className="md:text-xl text-[19px] font-semibold">Contact</h2>
                    <p>📞 {contact?.phone}</p>
                    <p>📧 {contact?.email}</p>
                </div>

                {/* Opening Hours */}
                <div className="mt-6">
                    <h2 className="md:text-xl text-[19px] font-semibold">Opening Hours</h2>
                    <ul className="list-disc list-inside text-gray-700">
                    {Object.entries(openingHours).map(([day, hours]) => (
                        <li key={day} className="capitalize">
                        {day}: {hours}
                        </li>
                    ))}
                    </ul>
                </div>

                {/* Menu */}
                <div className="mt-6">
                    <h2 className="md:text-xl text-[19px] font-semibold">Menu</h2>
                    <ul className="divide-y divide-gray-200">
                    {menu?.map((dish) => (
                        <li key={dish._id} className="py-2 flex justify-between">
                        <span>{dish.item}</span>
                        <span className="font-medium">₹{dish.price}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                <div>
                    <h1 className="md:text-3xl text-[25px] font-bold mb-10 mt-10">Reviews</h1>
                    <RestaurantReviews  restaurantId={_id}/>
                </div>
                <div>
                    <h1 className="md:text-3xl text-[25px] font-bold mb-10 mt-10">Recommendations</h1>
                    <Recommendations />
                </div>
            </div>
            
        </div>
    );
}

export default RestaurantDetails;