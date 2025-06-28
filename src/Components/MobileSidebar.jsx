import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Target,
  Utensils,
  Bookmark,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

function MobileSidebar({ logOut }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logOut();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const navItems = [
    { label: "Profile", icon: <User size={20} />, route: "/profile" },
    { label: "Goals", icon: <Target size={20} />, route: "/goaltracking" },
    { label: "Recipes", icon: <Utensils size={20} />, route: "/recipes" },
    { label: "Bookmarks", icon: <Bookmark size={20} />, route: "/bookmarks" },
    { label: "Shopping", icon: <ShoppingCart size={20} />, route: "/shoppinglist" },
    { label: "Logout", icon: <LogOut size={20} />, onClick: handleLogout },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2E8B57] flex justify-around py-2 text-white shadow-md md:hidden ">
      {navItems.map((item, idx) => {
        const isActive = location.pathname === item.route;
        return (
          <button
            key={idx}
            onClick={item.onClick || (() => navigate(item.route))}
            className={`flex flex-col items-center text-xs transition-colors duration-200 ${
              isActive ? "text-black font-semibold" : "hover:text-black"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MobileSidebar;
