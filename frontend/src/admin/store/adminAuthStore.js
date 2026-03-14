import { create } from "zustand";
import api from "../../api/axios.js";

const useAdminAuthStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem("admin_user")) || null,
  isAdmin: !!localStorage.getItem("admin_user"),

  checkAdmin: async () => {
    try {
      const { data } = await api.get("/auth/me");
      if (data.user.role !== "admin") throw new Error("Not admin");
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      set({ admin: data.user, isAdmin: true });
      return true;
    } catch {
      localStorage.removeItem("admin_user");
      set({ admin: null, isAdmin: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("admin_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ admin: null, isAdmin: false });
  },
}));

export default useAdminAuthStore;