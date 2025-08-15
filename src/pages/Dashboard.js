// src/pages/Dashboard.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // dummy data for now, later replace with real backend fetch
    const storedVideos = JSON.parse(localStorage.getItem("videos")) || [];
    setVideos(storedVideos);
  }, []);

  const handleUpload = () => {
    navigate("/upload");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleWatch = (videoUrl) => {
    navigate(`/watch/${videoUrl}`); // You can modify if you use slug or id
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        Upload New Video
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => handleWatch(video.url)}
            >
              <video
                src={video.url}
                controls
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-500">Likes: {video.likes || 0}</p>
              <p className="text-sm text-gray-500">Comments: {video.comments?.length || 0}</p>
            </div>
          ))
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
