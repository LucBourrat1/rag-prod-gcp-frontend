import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function DocumentList({
  token,
  documents,
  setDocuments,
  selectedDocs,
  setSelectedDocs,
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`${API_URL}/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setError(null);
        setDocuments(res.data.documents);
      } catch (err) {
        console.error("Erreur de chargement des documents", err);
        setError(
          "Impossible de charger la liste des documents. Réessaie de te reconnecter.",
        );
      }
    };
    fetchDocuments();
  }, [token, setDocuments]);

  const toggleDoc = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-2">
      <h2 className="text-sm font-medium text-gray-700">Documents</h2>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && documents.length === 0 && (
        <p className="text-xs text-gray-400">Aucun document pour l'instant.</p>
      )}
      <ul className="space-y-1">
        {documents.map((doc) => (
          <li key={doc.doc_id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedDocs.includes(doc.doc_id)}
              onChange={() => toggleDoc(doc.doc_id)}
            />
            <span className="truncate text-gray-700">{doc.filename}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
