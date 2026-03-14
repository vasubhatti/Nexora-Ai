import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, LogOut, Shield,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useAdminAuthStore from "../store/adminAuthStore.js";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="dark flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-zinc-800/50 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-zinc-800/50">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-black" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              Nexora Admin
            </p>
            <p className="text-zinc-600 text-[10px]">Control Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/50 space-y-1">
          <Separator className="bg-zinc-800/50 mb-2" />
          <div className="px-3 py-1.5">
            <p className="text-xs text-white font-medium truncate">{admin?.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{admin?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;