import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Upload({ token, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      setError("Seuls les PDFs sont acceptés");
      return;
    }

    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onUpload(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset l'input pour pouvoir réuploader le même fichier
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Uploader un PDF
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />
      {uploading && (
        <p className="text-xs text-gray-400">Indexation en cours…</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
