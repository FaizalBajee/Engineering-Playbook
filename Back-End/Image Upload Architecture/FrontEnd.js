/**
 * File: ProductImageUpload.jsx
 *
 * Production-grade file upload example
 */

import React, { useState } from "react";
import axios from "axios";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function ProductImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ Handle file select
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError("");

    if (!selected) return;

    // 🔐 Type validation
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG, WEBP allowed");
      return;
    }

    // 🔐 Size validation
    if (selected.size > MAX_SIZE) {
      setError("File must be less than 5MB");
      return;
    }

    setFile(selected);

    // ✅ Preview
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
  };

  // ✅ Upload handler
  const handleUpload = async () => {
    if (!file) {
      setError("Product image is required");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      await axios.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percent);
        },
      });

      alert("Upload successful");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h3>Product Image Upload</h3>

      {/* File input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Error */}
      {error && (
        <div style={{ color: "red", marginTop: 8 }}>{error}</div>
      )}

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: "100%",
            marginTop: 12,
            borderRadius: 8,
          }}
        />
      )}

      {/* Progress */}
      {uploading && (
        <div style={{ marginTop: 12 }}>
          Uploading… {progress}%
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: 16 }}
      >
        Upload Image
      </button>
    </div>
  );
}

export default ProductImageUpload;
