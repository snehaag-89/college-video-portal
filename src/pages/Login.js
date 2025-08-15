// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Example: predefined class passwords
    const passwords = {
      classA: "passA",
      classB: "passB",
      classC: "passC",
    };

    if (passwords[className] && passwords[className] === password) {
      localStorage.setItem("className", className);
      navigate("/home");
    } else {
      alert("Invalid class name or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Class Login</h2>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Class Name</span>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-2 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
