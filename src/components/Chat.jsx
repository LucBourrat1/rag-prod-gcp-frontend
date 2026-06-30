import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Chat({ token, selectedDocs }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // [{question, answer, sources}]
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || selectedDocs.length === 0) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/chat`,
        { question, document_ids: selectedDocs },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((prev) => [...prev, { question, ...res.data }]);
      setQuestion("");
    } catch (err) {
      console.error("Erreur chat", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-1">
            <p className="font-medium text-gray-800">{msg.question}</p>
            <p className="text-gray-600 text-sm">{msg.answer}</p>
            {msg.sources?.length > 0 && (
              <ul className="text-xs text-gray-400 space-y-0.5">
                {msg.sources.map((s, j) => (
                  <li key={j}>
                    📄 {s.filename} — p.{s.page}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {selectedDocs.length === 0 && (
          <p className="text-sm text-gray-400">
            Sélectionne au moins un document pour poser une question.
          </p>
        )}
      </div>
      <div className="border-t p-3 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Pose une question…"
          disabled={loading || selectedDocs.length === 0}
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={handleAsk}
          disabled={loading || selectedDocs.length === 0}
          className="bg-gray-800 text-white text-sm px-4 py-2 rounded-md disabled:opacity-40"
        >
          {loading ? "…" : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
