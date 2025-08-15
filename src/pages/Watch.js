// src/pages/Watch.js
import React, { useEffect, useState } from "react";

export default function Watch() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const className = localStorage.getItem("className");

  useEffect(() => {
    if (!className) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    fetch(`http://localhost:5000/videos?className=${className}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, [className]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading videos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Uploaded Videos for Class {className}
      </h1>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">
          No videos uploaded for your class yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <video
                controls
                className="w-full rounded-lg mb-2"
                src={video.url}
              ></video>
              <p className="text-gray-700 font-medium">{video.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
