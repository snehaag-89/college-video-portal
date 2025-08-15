// src/pages/Upload.js
import React, { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Login check
  const className = localStorage.getItem("className");
  if (!className) {
    alert("Please login first to upload videos!");
    window.location.href = "/login";
    return null;
  }

  const handleUpload = async () => {
    if (!video || !title) {
      setMessage("Please provide both title and video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("className", className); // so backend knows user's class

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "Video uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Upload Video
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Title</span>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700 font-medium">Select Video</span>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>

        {message && (
          <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
