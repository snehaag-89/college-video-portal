// backend/server.js


import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

// Multer setup for temporary file storage
const upload = multer({ dest: "uploads/" });

// In-memory video metadata store (replace with DB in production)
let videos = [];
const videosMetaPath = path.join(__dirname, "videos.json");
// Load existing metadata if present
if (fs.existsSync(videosMetaPath)) {
  try {
    videos = JSON.parse(fs.readFileSync(videosMetaPath, "utf-8"));
  } catch (e) {
    videos = [];
  }
}

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Upload route

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const file = req.file;
    const { title, className } = req.body;
    if (!file || !title || !className) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save to local uploads/className folder
    const classFolder = path.join(__dirname, "uploads", className);
    if (!fs.existsSync(classFolder)) fs.mkdirSync(classFolder, { recursive: true });
    const localFileName = `${Date.now()}-${file.originalname}`;
    const localFilePath = path.join(classFolder, localFileName);
    fs.copyFileSync(file.path, localFilePath);

    // Upload to Supabase
    const fileBuffer = fs.readFileSync(file.path);
    const supabasePath = `${className}/${localFileName}`;
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(supabasePath, fileBuffer, {
        contentType: file.mimetype,
      });

    // Only proceed if Supabase upload is successful
    if (!error) {
      let publicUrl = "";
      if (process.env.SUPABASE_PUBLIC_READ === "true") {
        const { data: publicData } = supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(supabasePath);
        publicUrl = publicData.publicUrl;
      } else {
        const { data: signedData } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .createSignedUrl(supabasePath, process.env.SIGNED_URL_TTL);
        publicUrl = signedData.signedUrl;
      }

      // Save metadata ONLY if Supabase upload succeeded
      const videoMeta = {
        id: Date.now().toString(),
        title,
        className,
        localUrl: `/uploads/${className}/${localFileName}`,
        supabaseUrl: publicUrl,
        uploadedAt: new Date().toISOString(),
      };
      videos.push(videoMeta);
      fs.writeFileSync(videosMetaPath, JSON.stringify(videos, null, 2));

      // Delete temp file
      fs.unlinkSync(file.path);

      res.json({
        message: "Video uploaded successfully!",
        video: videoMeta,
      });
    } else {
      // Delete temp file
      fs.unlinkSync(file.path);
      // Optionally, also delete the local copy
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      res.status(500).json({ error: "Supabase upload failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Serve local uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.delete("/video/:id", async (req, res) => {
  const { id } = req.params;
  const video = videos.find((v) => v.id === id);
  if (!video) return res.status(404).json({ error: "Video not found" });

  // Remove from Supabase Storage
  try {
    const supabasePath = video.supabaseUrl
      ? decodeURIComponent(new URL(video.supabaseUrl).pathname.replace(`/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/`, ""))
      : null;
    if (supabasePath) {
      await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([supabasePath]);
    }
  } catch (e) {
    console.error("Failed to delete from Supabase:", e.message);
  }

  // Remove from local uploads
  try {
    if (video.localUrl) {
      const localPath = path.join(__dirname, video.localUrl.replace(/^\//, ""));
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    }
  } catch (e) {
    console.error("Failed to delete local file:", e.message);
  }

  // Remove from videos.json
  videos = videos.filter((v) => v.id !== id);
  fs.writeFileSync(videosMetaPath, JSON.stringify(videos, null, 2));

  res.json({ message: "Video deleted" });
});

// GET /videos?className=xyz
app.get("/videos", async (req, res) => {
  const { className } = req.query;
  if (!className) return res.status(400).json({ error: "Missing className" });
  const filtered = videos.filter((v) => v.className === className);

  // Check if Supabase file exists for each video
  const validVideos = [];
  for (const video of filtered) {
    if (!video.supabaseUrl) continue;
    try {
      // Try to fetch HEAD of the file (public bucket only)
      const resp = await fetch(video.supabaseUrl, { method: 'HEAD' });
      if (resp.ok) {
        validVideos.push({ id: video.id, title: video.title, localUrl: video.localUrl, supabaseUrl: video.supabaseUrl });
      }
    } catch (e) {
      // Ignore videos that can't be reached
    }
  }
  res.json(validVideos);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
