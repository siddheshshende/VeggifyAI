/*remove all and simply add this email and password validations  
 const validateEmail = (email: string) => {     
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     return emailRegex.test(email);   
  };  password must be Minimum 8 characters including uppercase, lowercase, and number  
  show simple error message like this                    
  {errors.email && (                                {errors.email}                   email: !formData.get("email")         ? "Please complete this required field."         : !validateEmail(formData.get("email") as string)           ? "Please enter a valid email address"           : "",      keep remaining code as it is
 */

import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/profile"); // Navigate to profile page on successful login
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Signed up successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully!");
      navigate("/profile"); // Navigate to profile page after sign-in
    } catch (error) {
      console.error("Error signing in:", error.code, error.message);
      toast.error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google successfully!");
      navigate("/profile"); // Navigate to profile page after Google sign-in
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="min-h-screen   flex items-center justify-center px-4">
      <div className="bg-neutral-100  p-8 rounded-lg shadow-lg w-96">
        {!user ? (
          <>
            <h1 className="text-3xl sm:text-4xl mb-8 text-center text-green-600 capitalize font-bold">
              {" "}
              <u> Veggify</u>
            </h1>
            <h2 className="text-3xl font-semibold mb-5 text-center text-black">
              {isSignIn ? "Sign In" : "Sign Up"}
            </h2>
            <button
              onClick={signInWithGoogle}
              className="p-2 border-2 rounded-lg border-black font-medium text-black  w-full mb-4">
              {isSignIn ? "Sign in with Google" : "Sign up with Google"}
            </button>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              aria-label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg p-2 mb-4 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              id="password"
              type="password"
              aria-label="Password"
              placeholder={
                isSignIn
                  ? "Enter your password"
                  : "Create a password (min 8 characters)"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg p-2 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            {isSignIn ? (
              <button
                onClick={signIn}
                className="w-full p-2 mb-4 rounded-lg bg-black text-white  hover:bg-gray-800 transition-colors">
                Sign in
              </button>
            ) : (
              <button
                onClick={signUp}
                className="w-full p-2 mb-4 rounded-lg bg-black text-white  hover:bg-gray-800 transition-colors">
                Create Account
              </button>
            )}
            <div className="text-center text-sm">
              {isSignIn ? "New user? " : "Already Registered? "}
              <button
                onClick={toggleSignIn}
                className="text-blue-500 hover:underline">
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-lg font-medium text-black">
            Welcome! You’re logged in.
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
