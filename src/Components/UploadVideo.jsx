import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("video"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// Serve video files
app.use("/videos", express.static("./uploads"));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
