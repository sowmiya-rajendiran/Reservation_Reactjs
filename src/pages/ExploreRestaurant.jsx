import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import RestaurantDisplay from "../components/RestaurantDisplay";
import RestaurantFilters from "../components/FilterRestaurant";

const Restaurants = () => {
  const { restaurants = [] } = useLoaderData() || {};
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 6; 

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Pagination logic
  const indexOfLast = currentPage * restaurantsPerPage;
  const indexOfFirst = indexOfLast - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);


  return (
    <div>
      {restaurants.length === 0 ? (
        <div className="text-center mt-[200px] px-[100px]">
          <h1 className="text-[20px] font-semibold mb-[16px]">
            No restaurants found
          </h1>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="sticky top-0 md:px-[100px] px-[25px] py-[25px] flex justify-between items-center bg-black shadow-lg">
            <h1 className="sm:text-[25px] text-[20px] font-semibold text-white">
              Popular Restaurants
            </h1>
            <div>
              {!token ? (
                <>
                  <Link
                    to="/register"
                    className="py-[6px] text-[17px] text-white font-semibold mr-[15px]"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="py-[6px] text-[17px] mr-[15px] text-white font-semibold"
                  >
                    Login
                  </Link>
                </>
              ) : null}

               <button
                onClick={() => navigate(-1)}
                className="px-[25px] py-[6px] text-[16px] bg-white rounded-[4px]"
              >
                Back
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="sm:flex gap-[30px] lg:px-[100px] md:px-[50px] px-[25px] py-[50px]">
            {/* Filters */}
            <div className="sm:w-1/5 w-full sm:mb-0 mb-[25px]">
              <h1 className="text-[18px] font-semibold text-gray-600 mb-[15px]">
                Filters
              </h1>
              <RestaurantFilters
                restaurants={restaurants}
                setFilteredRestaurants={(data) => {
                  setFilteredRestaurants(data);
                  setCurrentPage(1); 
                    
                }}
              />
            </div>

            {/* Restaurants */}
            <div className="sm:w-4/5 w-full">
              {currentRestaurants.length > 0 ? (
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[35px]">
                  {currentRestaurants.map((restaurant) => (
                    <RestaurantDisplay key={restaurant._id} restaurant={restaurant} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 mt-10">
                  No restaurants found
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 border border-black rounded disabled:opacity-50 cursor-pointer"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 cursor-pointer border rounded ${
                        currentPage === i + 1 ? "bg-black text-white" : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;