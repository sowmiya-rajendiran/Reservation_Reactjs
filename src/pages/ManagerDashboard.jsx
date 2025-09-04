import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { restaurantAPI } from "../instances/endpoint";
import UserMenu from "../components/UserMenu";
import ManagerRestaurantEditor from "../components/ManagerRestaurantEditor";
import toast, { Toaster } from "react-hot-toast";

export default function ManagerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "manager") {
      navigate("/login");
      return;
    }
    fetchMyRestaurants();
   
  }, [user]);

  async function fetchMyRestaurants() {
    setLoading(true);
    try {
      const res = await restaurantAPI.getMyRestaurants();
      setRestaurants(res.data.data.restaurants || res.data.data);
    } catch (err) {
      console.error("Fetch restaurants error", err);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (restaurant) => {
    setEditing(restaurant);
    setCreating(false);
  };

  const handleCreate = () => {
    setEditing(null);
    setCreating(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await restaurantAPI.deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      toast.success("Restaurant deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleSaved = (savedRestaurant) => {
    setRestaurants((prev) => {
      const idx = prev.findIndex((r) => r._id === savedRestaurant._id);
      if (idx === -1) return [savedRestaurant, ...prev];
      const clone = [...prev];
      clone[idx] = savedRestaurant;
      return clone;
    });
    setEditing(null);
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <header className="bg-black text-white px-6 py-7 md:flex justify-between items-center">
        <h1 className="text-xl font-bold md:mb-0 mb-[25px] md:text-left text-center">🍽 Manager Dashboard</h1>
        <UserMenu 
          user={user} 
          onLogout={() => {
              localStorage.removeItem("token");
              navigate("/login"); 
            }} 
        />
      </header>

      <main className="p-6">
        <div className="md:flex justify-between items-center md:mb-4 mb-[20px]">
          <h2 className="text-lg font-semibold">Your Restaurants</h2>
          <div className="flex gap-2 md:mt-0 mt-[20px]">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={handleCreate}
            >
              Create Restaurant
            </button>
            <button
              className="bg-gray-200 px-3 py-1 rounded"
              onClick={() => fetchMyRestaurants()}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : restaurants.length === 0 ? (
          <div className="text-sm text-gray-600">No restaurants yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded shadow flex flex-col gap-3"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`http://localhost:3005${r.photos?.[0] || "/uploads/no-image.png"}`}
                    // src={`https://reservation-nodejs.onrender.com${r.photos?.[0] || "/uploads/no-image.png"}`}
                    alt={r.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <div className="text-xs text-gray-500">
                          {r.location?.address}
                        </div>
                        <div className="text-xs text-gray-500">
                          Phone: {r.contact?.phone}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-sm bg-yellow-300 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-sm bg-red-400 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm">
                      <div className="font-medium">Menu:</div>
                      <ul className="list-disc ml-5">
                        {r.menu?.length > 0 ? (
                          r.menu.slice(0, 3).map((m, i) => (
                            <li key={i}>
                              {m.name} — ₹{m.price}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400">No menu items</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(creating || editing) && (
          <div className="mt-6">
            <ManagerRestaurantEditor
              restaurant={editing}
              onSaved={handleSaved}
              onCancel={() => {
                setEditing(null);
                setCreating(false);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}