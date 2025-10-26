import { useState } from "react";
import axios from "axios";
import "./App.css"; // Import our CSS

export default function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setCaption("");
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");
    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);

    try {
      const res = await axios.post("https://ai-img-cap.onrender.com/caption", formData);
      setCaption(res.data.caption);
    } catch (err) {
      console.error(err);
      alert("Error generating caption!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Image Caption Generator</h1>
        <p>Upload an image and get an AI-generated caption instantly!</p>
      </header>

      <div className="card">
        <div>

        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="preview-image"
          />
        ) : (
          <div className="preview-placeholder">Preview will appear here</div>
        )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Generating..." : "Generate Caption"}
        </button>

        {caption && <div className="caption-box">{caption}</div>}
      </div>

      <footer>
        Buy me a coffee! ☕
      </footer>
    </div>
  );
}
