import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Utensils,
  Target,
  ShoppingCart,
  ShieldCheck,
  Heart,
  ChevronRight,
  User,
  Bookmark,
  AlertCircle,
} from "lucide-react";
import BannerImage1 from "../assets/BannerImg1.webp";
import BannerImage3 from "../assets/BannerImg3.webp";

const Home = () => {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  // Animation timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 2900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white overflow-x-hidden">
      {/* Header with Login Button */}
      <header className="flex justify-between items-center 3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-6 sm:py-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E8B57]">
            VeggifyAI
          </h1>
          <p className="text-gray-500 mt-2 hidden md:block">
            Your Personal Health Companion
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#2E8B57] hover:bg-[#1e6b47] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-12 sm:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Healthy Eating <span className="text-[#2E8B57]">Simplified</span>{" "}
              For Your Lifestyle
            </h2>
            <p className="text-lg text-gray-600">
              Personalized recipes, goal tracking, and nutrition management to
              help you adopt and maintain a healthier plant-based lifestyle.{" "}
              <span className="font-medium text-[#2E8B57]">
                Our recipes consider your allergies and chronic diseases
              </span>{" "}
              for truly personalized health support.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-[#2E8B57] hover:bg-[#1e6b47] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                Get Started <ChevronRight size={20} className="ml-2" />
              </button>
              <button
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  featuresSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white hover:bg-gray-100 text-[#2E8B57] border-2 border-[#2E8B57] font-bold py-3 px-8 rounded-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={BannerImage1}
              alt="Healthy food illustration"
              className="rounded-lg shadow-xl transform transition-all duration-500 hover:rotate-2 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Health-Conscious USP Section - New */}
      <section className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-12 sm:py-20 bg-green-100">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Recipes customized to{" "}
            <span className="text-[#2E8B57]">Your Health Needs</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="md:w-1/2 flex items-center justify-center">
              <img
                src={BannerImage3}
                alt="Health-conscious meal planning"
                className="rounded-lg shadow-xl size-2/3 transform transition-all duration-500 hover:rotate-2 hover:scale-105"
              />
            </div>
            <div className="md:w-1/2 text-left space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-200 p-3 rounded-lg mt-1">
                  <AlertCircle size={24} className="text-[#2E8B57]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    Allergy-Aware Recipes
                  </h3>
                  <p className="text-gray-700">
                    Our smart recipe generator automatically filters out
                    ingredients you're allergic to, ensuring every meal is safe
                    for you to enjoy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-200 p-3 rounded-lg mt-1">
                  <ShieldCheck size={24} className="text-[#2E8B57]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    Chronic Disease Management
                  </h3>
                  <p className="text-gray-700">
                    Managing conditions like diabetes, hypertension, or heart
                    disease? Our recipes are designed with your specific health
                    requirements in mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-12 sm:py-20 bg-green-50">
        <div className="">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            What <span className="text-[#2E8B57]">Veggify</span> Offers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className={`bg-white p-6 text-center rounded-xl shadow-lg  transition-all ease-in-out duration-150 transform hover:scale-105   ${
                showFeatures
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
             >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Utensils size={28} className="text-[#2E8B57]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 ">
                Personalized Recipes
              </h3>
              <p className="text-gray-600">
                Generate custom recipes based on your preferences, dietary
                restrictions, and available ingredients.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`bg-white p-6 rounded-xl text-center shadow-lg transition-all ease-in-out duration-150 transform hover:scale-105 ${
                showFeatures
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Target size={28} className="text-[#2E8B57]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Goal Tracking
              </h3>
              <p className="text-gray-600">
                Set nutrition and health goals with deadlines, and track your
                progress over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`bg-white p-6 rounded-xl text-center shadow-lg transition-all duration-300 transform hover:scale-105 ${
                showFeatures
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ShoppingCart size={28} className="text-[#2E8B57]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Smart Shopping List
              </h3>
              <p className="text-gray-600">
                Automatically generate shopping lists based on your selected
                recipes and meal plans.
              </p>
            </div>
          </div>

          {/* Additional Features - New Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Profile Feature */}
            <div
              className={`bg-white p-6 rounded-xl text-center shadow-lg transition-all duration-300 transform hover:scale-105 ${
                showFeatures
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <User size={28} className="text-[#2E8B57]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Comprehensive Profile
              </h3>
              <p className="text-gray-600">
                Create your health profile with details about allergies, chronic
                diseases, dietary preferences, and physical attributes to
                receive truly personalized recommendations.
              </p>
            </div>

            {/* Bookmarks Feature */}
            <div
              className={`bg-white p-6 rounded-xl text-center shadow-lg transition-all duration-300 transform hover:scale-105 ${
                showFeatures
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Bookmark size={28} className="text-[#2E8B57]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Recipe Bookmarks
              </h3>
              <p className="text-gray-600">
                Save your favorite recipes for quick access later. Build a
                personal collection of safe and beneficial meals customized to
                your health profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-12 sm:py-20">
        <div className="">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            How <span className="text-[#2E8B57]">Veggify</span> Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#2E8B57] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mb-6 mx-auto transform transition-all duration-300 hover:scale-110">
                  1
                </div>
                {/* Connector line */}
                {/*<div className="hidden md:block absolute top-12 left-full w-full h-1 bg-[#2E8B57]"></div> */}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up and tell us about your dietary preferences, allergies,
                chronic diseases, and health goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#2E8B57] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mb-6 mx-auto transform transition-all duration-300 hover:scale-110">
                  2
                </div>
                {/* Connector line */}
                {/*<div className="hidden md:block absolute top-12 left-full w-full h-1 bg-[#2E8B57]"></div> */}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Discover Recipes & Set Goals
              </h3>
              <p className="text-gray-600">
                Browse personalized recipes that account for your health
                conditions and create goals tailored to your needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#2E8B57] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mb-6 mx-auto transform transition-all duration-300 hover:scale-110">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                Track & Improve
              </h3>
              <p className="text-gray-600">
                Monitor your progress, bookmark favorite recipes, adjust your
                goals, and enjoy a healthier lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-12 sm:py-20 bg-green-50">
        <div className="">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Benefits of Using <span className="text-[#2E8B57]">Veggify</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Heart size={24} className="text-[#2E8B57]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Healthier Eating Habits
                </h3>
                <p className="text-gray-600">
                  Develop sustainable eating patterns with nutritionally
                  balanced meal options tailored to your health conditions.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <ShieldCheck size={24} className="text-[#2E8B57]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Diet Compliance
                </h3>
                <p className="text-gray-600">
                  Stay on track with your nutritional goals with personalized
                  reminders and progress tracking that considers your health
                  profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4 py-12 sm:py-20">
        <div className=" text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-800 mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Veggify today and take the first step towards a healthier
            lifestyle customized to your unique health profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#2E8B57] hover:bg-[#1e6b47] text-white font-bold py-3 px-8 sm:px-10 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg sm:text-xl">
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="3xl:px-48 2xl:px-40 xl:px-32 lg:px-20 md:px-12 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
                VeggifyAI
              </h2>
              <p className="text-gray-400 text-center sm:text-left">
                Your Personal Health Companion
              </p>
            </div>
            <div className="text-center md:text-right">
              <p>
                © {new Date().getFullYear()} VeggifyAI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
