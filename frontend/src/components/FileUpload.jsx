
import { useRef, useState } from "react";

import api from "../api";
import toast from "react-hot-toast";

export default function FileUpload() {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

   
    const allowedTypes = ["application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      toast.error(" Only PDF  files are allowed");
      fileInputRef.current.value = "";
      return;
    }


    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(` File is too large. Max size is ${maxSizeMB} MB`);
      fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      setUploading(true);
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(" File uploaded successfully:", res.data);
      toast.success(" File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(" Upload failed. Try again.");
    } finally {
      setUploading(false);
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <input
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "⏳ Uploading..." : "📤 Upload Notes (PDF)"}
      </button>
    </div>
  );
}
