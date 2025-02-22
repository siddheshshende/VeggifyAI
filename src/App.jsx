import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

  useEffect(() => {
    // Set up an authentication state observer
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
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
  console.log(isLoggedIn);
  return (
    <div>
      <BrowserRouter>
        <div className='flex gap-[15vh]'>
          <div className='w-[35vh]'>
            {isLoggedIn && (
              <div className='fixed h-screen w-[35vh]'>
                <Sidebar logOut={logOut} />
             
              </div>
              
            )}
          </div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/home" element={<Home />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/goaltracking" element={<GoalTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shoppinglist" element={<ShoppingList />} />
          </Routes>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;



/*import { BrowserRouter, Routes, Route}  from 'react-router-dom'
import Recipes from "./Components/Recipes"
import Bookmarks from "./Components/Bookmarks"
import GoalTracking from "./Components/GoalTracking"
import Profile from "./Components/Profile"
import Home from "./Components/Home"
import ShoppingList from "./Components/ShoppingList"
import Sidebar from './Components/Sidebar'
import Login from './Components/Login'
import { auth } from '../src/config/firebase';
import '../src/config/firebase';
import { useState, useEffect } from 'react'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Set up an authentication state observer
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, []);


  return (
    <>
    <div>

   <BrowserRouter>

  <div className='flex gap-[15vh]'>
   <div className='w-[35vh]'>
   {isLoggedIn && (
             <div className='fixed h-screen w-[35vh]'>
             <Sidebar />
           </div>
          )}
   </div>


   <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/recipes" element={<Recipes/>} />
      <Route path="/home" element={<Home />} />
      <Route path="/bookmarks" element={<Bookmarks/>} />
      <Route path="/goaltracking" element={<GoalTracking/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/shoppinglist" element={<ShoppingList/>} />
      
     </Routes>

     </div>
    
     </BrowserRouter>

    </div>
    </>
  )
}

export default App
*/