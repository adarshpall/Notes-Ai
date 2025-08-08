// import { useRef, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function FileUpload() {
//   const fileInputRef = useRef();
//   const [uploading, setUploading] = useState(false);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading(true);
//       const res = await axios.post("http://localhost:5000/api/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("✅ File uploaded successfully:", res.data);
//       toast.success("✅ File uploaded!");

//     } catch (err) {
//       console.error("❌ Upload failed:", err);
//       toast.error("❌ Upload failed");

//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center hover:bg-gray-50">
//       <input
//         type="file"
//         onChange={handleFileUpload}
//         ref={fileInputRef}
//         className="hidden"
//         accept=".pdf,.doc,.docx"
//       />
//       <button
//         onClick={() => fileInputRef.current.click()}
//         className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
//         disabled={uploading}
//       >
//         {uploading ? "Uploading..." : "Upload Notes (PDF/DOCX)"}
//       </button>
//     </div>
//   );
// }
import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FileUpload() {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ File uploaded successfully:", res.data);
      toast.success("✅ File uploaded!");

    } catch (err) {
      console.error("❌ Upload failed:", err);
      toast.error("❌ Upload failed");

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center hover:bg-gray-50 dark:hover:bg-gray-800">
      <input
        type="file"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Notes (PDF/DOCX)"}
      </button>
    </div>
  );
}
