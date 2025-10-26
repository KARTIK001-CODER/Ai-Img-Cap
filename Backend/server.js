import express from "express";
import multer from "multer";
import { pipeline } from "@xenova/transformers";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

let imageCaptioner;

// Load the model once at startup
(async () => {
  console.log("⏳ Loading model...");
  imageCaptioner = await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning");
  console.log("✅ Model loaded!");
})();

// Route for image upload and captioning
app.post("/caption", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image provided" });

  try {
    const imagePath = req.file.path;
    const result = await imageCaptioner(imagePath);
    fs.unlinkSync(imagePath); // Delete uploaded file after use
    res.json({ caption: result[0].generated_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating caption" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
