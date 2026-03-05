import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDark: localStorage.getItem("theme") !== "light",

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
      if (newIsDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
      return { isDark: newIsDark };
    });
  },

  initTheme: () => {
    const isDark = localStorage.getItem("theme") !== "light";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
    return isDark;
  },
}));

export default useThemeStore;
