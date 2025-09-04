import { useState } from "react";
import { Link, useNavigate } from "react-router";


const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="md:flex items-center md:text-right text-center">
      <div className="md:mr-[20px] mr-0 md:mb-0 mb-[25px]">
        <Link to='/restaurant' className="md:text-[17px] text-[15px] font-semibold bg-white px-[20px] py-[8px] rounded text-black">Explore Restaurants</Link>
      </div>
      <div className="relative inline-block text-left">
        {/* Welcome Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          <p className="text-[17px]">Welcome, {user?.name}</p>
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white  shadow-lg z-10 text-black ">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile"); 
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Profile
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onLogout(); 
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;