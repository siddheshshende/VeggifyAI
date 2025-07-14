
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { 
  User, 
  Target, 
  Utensils, 
  Bookmark, 
  ShoppingCart, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Sidebar({ logOut, collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const navItems = [
    { label: "Profile", icon: <User size={20} />, route: "/profile" },
    { label: "Goals Tracking", icon: <Target size={20} />, route: "/goaltracking" },
    { label: "Recipes", icon: <Utensils size={20} />, route: "/recipes" },
    { label: "Bookmarks", icon: <Bookmark size={20} />, route: "/bookmarks" },
    { label: "Shopping List", icon: <ShoppingCart size={20} />, route: "/shoppinglist" },
    { label: "Logout", icon: <LogOut size={20} />, onClick: handleLogout },
  ];

  return (
    <div className={`h-full bg-[#2E8B57] relative transition-all ease-in-out duration-300 ${
      collapsed ? "w-15" : "w-64"
    }`}>
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-[#2E8B57] p-1 rounded-full text-white shadow-md hover:bg-[#1e6b47] transition"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo */}
      <div
        onClick={() => navigate("/profile")}
        className={`font-semibold ${collapsed ? "text-center text-3xl sm:text-4xl" : "text-5xl"} p-5 text-white cursor-pointer hover:underline truncate`}
      >
        {collapsed ? "V" : "VeggifyAI"}
      </div>

      {/* Tagline */}
      {!collapsed && (
        <div className="text-sm font-medium text-white px-5 py-1">
          Your Personal Health Companion
        </div>
      )}

      {/* Navigation Items */}
      <div className="pt-[15vh] flex flex-col text-white text-xl font-medium">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick || (() => navigate(item.route))}
            className={`py-3 ${
              collapsed ? "justify-center px-0" : "px-4 justify-start"
            } flex items-center gap-3 cursor-pointer rounded-l-lg hover:bg-[#1e6b47] hover:text-black transition duration-300`}
          >
            <div className={collapsed ? "mx-auto" : "ml-4"}>
              {item.icon}
            </div>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;