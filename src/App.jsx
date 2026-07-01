import { useState } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";
import DocumentList from "./components/DocumentList";
import Chat from "./components/Chat";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  if (!user) {
    return (
      <Login
        onLogin={(userInfo, idToken) => {
          setUser(userInfo);
          setToken(idToken);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">RAG Tutorial</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            onClick={() => {
              setUser(null);
              setToken(null);
              setDocuments([]);
              setSelectedDocs([]);
            }}
            className="text-sm text-red-500 hover:underline"
          >
            Déconnexion
          </button>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <Upload
            token={token}
            onUpload={(doc) => setDocuments((prev) => [doc, ...prev])}
          />
          <DocumentList
            token={token}
            documents={documents}
            setDocuments={setDocuments}
            selectedDocs={selectedDocs}
            setSelectedDocs={setSelectedDocs}
          />
        </div>
        <div className="col-span-2">
          <Chat token={token} selectedDocs={selectedDocs} />
        </div>
      </div>
    </div>
  );
}
