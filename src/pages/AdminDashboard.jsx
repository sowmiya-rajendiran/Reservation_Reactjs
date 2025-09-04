import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { adminAPI } from "../instances/endpoint";
import UserMenu from "../components/UserMenu";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Role-based redirect
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch data on tab change
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (activeTab === "restaurants") {
          const res = await adminAPI.getAllRestaurants();
          setRestaurants(res.data.data);
        } else if (activeTab === "reviews") {
          const res = await adminAPI.getAllReviews();
          setReviews(res.data.data);
        } else if (activeTab === "reservations") {
          const res = await adminAPI.getAllReservations();
          setReservations(res.data.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Delete restaurant
  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await adminAPI.deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      toast.success("Restaurant deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await adminAPI.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Cancel reservation
  const handleCancelReservation = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await adminAPI.cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      toast.success("Reservation canceled");
    } catch (err) {
      console.error(err);
      toast.error("Cancel failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Navbar */}
      <header className="bg-black text-white px-6 py-7 md:flex justify-between items-center">
        <h1 className="text-xl font-bold md:mb-0 mb-[25px] md:text-left text-center">🍽 Admin Dashboard</h1>
        <UserMenu
          user={user}
          onLogout={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />
      </header>

      {/* Tabs */}
      <div className="flex border-b mt-4 px-6">
        {["restaurants", "reviews", "reservations"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 cursor-pointer font-semibold ${
              activeTab === tab ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <div>Loading...</div>
        ) : activeTab === "restaurants" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.length === 0 ? (
              <div>No restaurants found</div>
            ) : (
              restaurants.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-4 rounded shadow-lg flex flex-col gap-3"
                >
                  <h3 className="font-semibold">{r.name}</h3>
                  <div className="text-sm text-gray-500">{r.location?.address}</div>
                  <div className="text-sm text-gray-500">Phone: {r.contact?.phone}</div>
                  <button
                    onClick={() => handleDeleteRestaurant(r._id)}
                    className="bg-gray-400 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "reviews" ? (
          <div>
            {reviews.length === 0 ? (
              <div>No reviews found</div>
            ) : (
              reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-4 rounded shadow-lg flex justify-between items-start mb-2"
                >
                  <div>
                    <div className="font-semibold">{r.user?.name}</div>
                    <div className="text-sm text-gray-500">{r.restaurant?.name}</div>
                    <div>{r.comment}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(r._id)}
                    className="bg-gray-400 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {reservations.length === 0 ? (
              <div>No reservations found</div>
            ) : (
              reservations.map((r) => (
                <div
                  key={r._id}
                  className="bg-white p-4 rounded shadow-lg flex justify-between items-start mb-2"
                >
                  <div>
                    <div className="font-semibold">{r.user?.name}</div>
                    <div className="text-sm text-gray-500">{r.restaurant?.name}</div>
                    <div>
                      {r.guests} guests on {new Date(r.date).toLocaleDateString()} at{" "}
                      {r.time}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelReservation(r._id)}
                    className="bg-gray-400 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}