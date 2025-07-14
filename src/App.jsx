import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React from "react"; 
import { useState, useEffect } from "react";
import Recipes from "./Components/Recipes";
import Bookmarks from "./Components/Bookmarks";
import GoalTracking from "./Components/GoalTracking";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import ShoppingList from "./Components/ShoppingList";
import Login from "./Components/Login";
import { auth } from "../src/config/firebase";
import { signOut } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Components/Layout"; // import your Layout

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Failed to log out:", err.message);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return (
      <Layout logOut={logOut}>
        {React.cloneElement(children, { logOut })}
      </Layout>
    );
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="relative overflow-hidden pb-2 mb-6">
          <h1 className="text-[#1e6b47] pb-2 text-4xl sm:text-6xl font-semibold capitalize opacity-0 animate-slide-fade-in">
            Veggify
          </h1>
          <div className="absolute left-0 bottom-0 w-full h-[3px] bg-[#1e6b47] overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-white origin-right scale-x-100 animate-mask-slide"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/profile" /> : <Login />}
        />

        {/* Protected Routes inside Layout */}
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goaltracking"
          element={
            <ProtectedRoute>
              <GoalTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shoppinglist"
          element={
            <ProtectedRoute>
              <ShoppingList />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}