import { create } from "zustand";
import api from "../api/axios.js";

const useCreditStore = create((set)=>({
    // States
    creditBalance: 0,
    creditsUsed: 0,
    creditsResetDate: null,
    subscription: "free",

    //Action Functions
    fetchBalance: async () => {
    try {
      const { data } = await api.get("/credits/balance");
      set({
        creditBalance: data.data.creditBalance,
        creditsUsed: data.data.creditsUsed,
        creditsResetDate: data.data.creditsResetDate,
        subscription: data.data.subscription,
      });
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  },

  deductCredits: (amount) => {
    set((state) => ({ creditBalance: state.creditBalance - amount }));
  },
}));

export default useCreditStore;