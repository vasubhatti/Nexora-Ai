import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import api from "../../api/axios.js";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (!accessToken || !refreshToken) {
        navigate("/login");
        return;
      }

      // Save tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Fetch user info
      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } catch {
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-zinc-400 text-sm">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;