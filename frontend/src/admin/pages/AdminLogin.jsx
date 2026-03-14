import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../api/axios.js";
import useAdminAuthStore from "../store/adminAuthStore.js";

const AdminLogin = () => {
  const navigate = useNavigate();
//   const { checkAdmin } = useAdminAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/auth/login", form);

      if (data.user.role !== "admin") {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      useAdminAuthStore.setState({ admin: data.user, isAdmin: true });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-zinc-500 text-sm">Nexora AI · Restricted Access</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-xs">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              required
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus-visible:ring-zinc-600"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-xs">Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-11 focus-visible:ring-zinc-600"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;