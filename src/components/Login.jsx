import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ onLogin }) {
  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    try {
      const res = await axios.post(`${API_URL}/auth/verify`, {
        token: idToken,
      });
      onLogin({ email: res.data.email, name: res.data.name }, idToken);
    } catch (err) {
      console.error("Token invalide", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-sm border text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">RAG Tutorial</h1>
        <p className="text-gray-500 text-sm">
          Connecte-toi pour uploader et interroger tes documents.
        </p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("Échec de la connexion Google")}
        />
      </div>
    </div>
  );
}
