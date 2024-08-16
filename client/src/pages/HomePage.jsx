import React from "react";
import heroimage from "../assets/supliful-supplements-on-demand-JljYkIwvfNs-unsplash.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-6 px-4 sm:px-6 lg:px-8 mx-6">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="text-center lg:text-left lg:flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
            Welcome to NutriTrack
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Achieve optimal health and wellness with NutriTrack, the all-in-one
            solution for managing your supplements. Whether you're a fitness
            enthusiast, health-conscious individual, or someone looking to
            streamline their supplement regimen, NutriTrack is here to simplify
            your journey.
          </p>
        </div>
        <div className="flex justify-center lg:flex-1">
          <img
            src={heroimage}
            alt="supplements"
            className="rounded-2xl shadow-lg w-full max-w-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
