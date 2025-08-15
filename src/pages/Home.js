// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = ({ className }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Welcome, Class{" "}
        <span className="text-blue-600">
          {className}
        </span>{" "}
        🎉
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        You can now upload videos for your class or watch the videos shared by
        your classmates.
      </p>
      <div className="flex space-x-4">
        <Link to="/upload">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600">
            Upload Video
          </button>
        </Link>
        <Link to="/watch">
          <button className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600">
            Watch Videos
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
