import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Recipes from "./Components/Recipes";
import Bookmarks from "./Components/Bookmarks";
import GoalTracking from "./Components/GoalTracking";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import ShoppingList from "./Components/ShoppingList";
import Sidebar from './Components/Sidebar';
import Login from './Components/Login';
import { auth } from '../src/config/firebase';
import { signOut } from "firebase/auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Failed to log out:", err.message);
    }
  };

  return (
    <div>
      <BrowserRouter>
        <div>
          <div className={isLoggedIn ? (sidebarCollapsed ? 'mr-0' : 'mr-0') : ''}>
            {isLoggedIn && (
              <div className="fixed h-screen ">
                <Sidebar 
                  logOut={logOut}
                  collapsed={sidebarCollapsed} 
                  setCollapsed={setSidebarCollapsed} 
                />
              </div>
            )}
          </div>
          <div className={`transition-all duration-300 ${isLoggedIn ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''}`}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={isLoggedIn ? <Navigate to="/profile" replace /> : <Login />} 
              />

              {/* Protected routes */}
              <Route path="/recipes" element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } />
              <Route path="/goaltracking" element={
                <ProtectedRoute>
                  <GoalTracking />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/shoppinglist" element={
                <ProtectedRoute>
                  <ShoppingList />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;