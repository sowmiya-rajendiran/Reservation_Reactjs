import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import UserMenu from "../components/UserMenu";
import MyReservations from "../components/MyReservations";
import MyReviews from "../components/MyReview";

function Dashboard(){
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== "user") {
            navigate("/login");
        }
    }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-black text-white px-6 py-7 md:flex justify-between items-center">
        <h1 className="text-xl font-bold  md:mb-0 mb-[25px] md:text-left text-center">🍽 User Dashboard</h1>
        <UserMenu
          user={user} 
          onLogout={() => {
            localStorage.removeItem("token");
            navigate("/login"); 
          }} 
        />
      </div>

        {/* Main content */}
        <div className="lg:px-[100px] md:px-[50px] px-[20px] py-[50px]">
        
        {/* Reservations card */}
        <MyReservations />

        {/* Reviews card */}
        <MyReviews />
        
      </div>
    </div>
  );
}

export default Dashboard;