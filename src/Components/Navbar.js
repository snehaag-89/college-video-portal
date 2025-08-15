// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const className = localStorage.getItem("className");

  const handleLogout = () => {
    localStorage.removeItem("className");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">College Video Portal</h1>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/upload" className="hover:underline">
          Upload
        </Link>
        <Link to="/watch" className="hover:underline">
          Watch
        </Link>
        {className && (
          <>
            <span className="font-medium">Class: {className}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
