// src/api/uploadthing.js
export const uploadVideo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
