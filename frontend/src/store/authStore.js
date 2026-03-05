import { create } from "zustand";
import api from "../api/axios.js";

const useAuthStore = create((set)=>({
    // States
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,

    // Action Functions (Methods)
    register: async (name,email,password)=> {
        set({loading: true,error:null});
        try {
            const {data} = await api.post("/auth/register",{name,email,password});
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            set({ error: message, loading: false });
            return { success: false, message };
        }
    },

    login: async (email,password)=> {
        set({loading:true,error:null});
        try {
            const {data} = await api.post("/auth/login",{email,password});
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, isAuthenticated: true, loading: false });
            return { success: true}
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            set({ error: message, loading: false });
            return { success: false, message };
        }
    },
    logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
  clearError: () => set({ error: null }),
}));

export default useAuthStore;