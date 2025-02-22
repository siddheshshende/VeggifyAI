import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Sidebar() {
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-[#2E8B57]">
      {/* "Veggify" logo with underline on hover and click to navigate */}
      <div 
        onClick={() => navigate("/home")} 
        className="font-semibold text-5xl p-5 text-white cursor-pointer hover:underline"
      >
        Veggify
      </div>
      <div className="text-sm font-medium text-white px-5 py-1 ">
        Your Personal Health Companion
      </div>

      <div className="pt-[30vh] grid-col-1 pl-8 text-white text-xl font-medium">
        <div onClick={() => navigate("/profile")} className="py-3 px-4 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300">
          Profile
        </div>
        <div onClick={() => navigate("/goaltracking")} className="py-3 px-4 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300">
          Goals Tracking
        </div>
        <div onClick={() => navigate("/recipes")} className="py-3 px-4 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300">
          Recipes
        </div>
        <div onClick={() => navigate("/bookmarks")} className="py-3 px-4 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300">
          Bookmarks
        </div>
        <div onClick={() => navigate("/shoppinglist")} className="py-3 px-4 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300">
          Shopping List
        </div>
        <div onClick={logOut} className="py-3 px-4 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300">
          Logout
        </div>
      </div>
    </div>
  );
}

export default Sidebar;



/*import { useNavigate } from 'react-router-dom';

function Sidebar({ logOut }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();  // Log out the user
    navigate("/");   // Redirect to the login page
  };

  return (
    <div className="h-screen bg-[#2E8B57]">
      <div className="font-semibold text-5xl p-5 text-white">Veggify</div>
      <div className="text-sm font-medium text-white px-5 py-1">
        Your Personal Health Companion
      </div>

      <div className="pt-[30vh] grid-col-1 pl-8 text-white text-xl font-medium">
        <div onClick={handleLogout} className="py-4 cursor-pointer text-black bg-yellow-300">
          Logout
        </div>
        <div onClick={() => navigate("/profile")} className="py-4 cursor-pointer">
          Profile
        </div>
        <div onClick={() => navigate("/goaltracking")} className="py-4 cursor-pointer">
          Goals Tracking
        </div>
        <div onClick={() => navigate("/recipes")} className="py-4 cursor-pointer">
          Recipes
        </div>
        <div onClick={() => navigate("/bookmarks")} className="py-4 cursor-pointer">
          Bookmarks
        </div>
        <div onClick={() => navigate("/shoppinglist")} className="py-4 cursor-pointer">
          Shopping List
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
*/