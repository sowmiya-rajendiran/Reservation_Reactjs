import { useNavigate } from "react-router";
import NoImage from "../assets/No_Image_Available.jpg";

function RestaurantDisplay({restaurant , onReserve}){

    const navigate = useNavigate();
    const handleReserveClick = () => {
        const isLoggedIn = localStorage.getItem("token");
        if (isLoggedIn) {
            navigate(`/restaurantdetails?id=${restaurant._id}`);
        } else {
            navigate("/login");
        }
        if (onReserve) {
            onReserve();
        }
    };
    return(
        <div className="shadow-lg rounded-[10px]">
                <img
                    className="h-[300px] w-[400px] object-cover m-auto rounded-t-[10px]"
                    // src={restaurant.photos[0]}
                    // src={`http://localhost:3005${restaurant.photos[0]}`}
                    src={`https://reservation-nodejs.onrender.com${restaurant.photos[0]}`}
                    alt={restaurant.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = NoImage;
                    }}
                         
                />
            <div className="px-3 py-5 rounded-b-[10px] text-center flex flex-col">
                <p className="text-[16px] font-bold hover:text-blue-400">{restaurant.name}</p>
                <button
                    onClick={handleReserveClick}
                    className="mt-[10px] px-[25px] py-[10px] text-[16px] bg-black text-white rounded-[4px] cursor-pointer"
                    >
                    Reserve
                </button>
            </div>

        </div>
    )
}

export default RestaurantDisplay;