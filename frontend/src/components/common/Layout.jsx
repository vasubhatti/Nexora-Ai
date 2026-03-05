import { useEffect, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import useCreditStore from "../../store/creditStore.js";
import useThemeStore from "../../store/themeStore.js";

const Layout = ({ children }) => {
  const { fetchBalance } = useCreditStore();
  const { isDark } = useThemeStore();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;