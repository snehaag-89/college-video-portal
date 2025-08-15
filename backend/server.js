// backend/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

// Multer setup for temporary file storage
const upload = multer({ dest: "uploads/" });

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Upload route
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `${Date.now()}-${file.originalname}`;
    const fileBuffer = fs.readFileSync(file.path); // Read file into buffer

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    let publicUrl = "";
    if (process.env.SUPABASE_PUBLIC_READ === "true") {
      const { data: publicData } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(filePath);
      publicUrl = publicData.publicUrl;
    } else {
      const { data: signedData } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .createSignedUrl(filePath, process.env.SIGNED_URL_TTL);
      publicUrl = signedData.signedUrl;
    }

    // Delete temp file from server after upload
    fs.unlinkSync(file.path);

    res.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
