import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare, Code, Image, FileText, ScanText,
  History, ChevronRight, Sun, Moon, LogOut, User,
  CreditCard, Zap, Menu, X, Home, PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "../../store/authStore.js";
import useCreditStore from "../../store/creditStore.js";
import useThemeStore from "../../store/themeStore.js";

const navSections = [
  {
    label: "Text AI",
    icon: MessageSquare,
    children: [
      { label: "Chat", path: "/chat" },
      { label: "Content Generator", path: "/generate" },
      { label: "Summarizer", path: "/summarize" },
      { label: "Translator", path: "/translate" },
      { label: "Grammar Check", path: "/grammar" },
    ],
  },
  {
    label: "Code AI",
    icon: Code,
    children: [
      { label: "Generate", path: "/code/generate" },
      { label: "Debug", path: "/code/debug" },
      { label: "Review", path: "/code/review" },
      { label: "Refactor", path: "/code/refactor" },
      { label: "Convert", path: "/code/convert" },
      { label: "Document", path: "/code/document" },
      { label: "Unit Tests", path: "/code/test" },
    ],
  },
  {
    label: "Image AI",
    icon: Image,
    children: [
      { label: "Generate Image", path: "/image/generate" },
      { label: "Create Logo", path: "/image/logo" },
      { label: "Social Graphic", path: "/image/social" },
    ],
  },
  {
    label: "Documents",
    icon: FileText,
    children: [
      { label: "Extract Text", path: "/document/extract" },
      { label: "Summarize", path: "/document/summarize" },
      { label: "Key Points", path: "/document/keypoints" },
      { label: "Ask Document", path: "/document/qa" },
    ],
  },
];

const bottomLinks = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "History", icon: History, path: "/history" },
  { label: "Subscription", icon: CreditCard, path: "/subscription" },
];

const SidebarContent = ({ collapsed, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { creditBalance, subscription } = useCreditStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (label) => {
    setOpenSections((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const totalCredits =
    subscription === "pro" ? 1000
    : subscription === "enterprise" ? 10000
    : 100;

  const creditPercent = Math.min((creditBalance / totalCredits) * 100, 100);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/50 overflow-hidden">
      {/* Header */}
      <div className={`flex items-center border-b border-zinc-800/50 h-14 flex-shrink-0 ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-xs">N</span>
            </div>
            <span className="font-semibold text-white text-sm">Nexora AI</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-bold text-xs">N</span>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Credits card — hidden when collapsed */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-zinc-800/50 flex-shrink-0">
          <div className="bg-zinc-900 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-zinc-400" />
                <span className="text-xs text-zinc-400">Credits</span>
              </div>
              <Badge variant="outline" className="text-[10px] h-4 border-zinc-700 text-zinc-400 capitalize">
                {subscription}
              </Badge>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-white font-semibold text-lg leading-none">{creditBalance}</span>
              <Link to="/subscription" className="text-[10px] text-zinc-500 hover:text-white transition-colors">
                Upgrade →
              </Link>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1">
              <div className="bg-white h-1 rounded-full transition-all duration-500" style={{ width: `${creditPercent}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Bottom links */}
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              title={collapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive(link.path)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && link.label}
            </Link>
          );
        })}

        <Separator className="my-2 bg-zinc-800/50" />

        {/* AI sections */}
        {navSections.map((section) => {
          const Icon = section.icon;
          const hasActiveChild = section.children?.some((c) => isActive(c.path));
          const isOpen = openSections.includes(section.label);

          if (collapsed) {
            return (
              <Link
                key={section.label}
                to={section.children[0].path}
                title={section.label}
                className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
                  hasActiveChild
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          }

          return (
            <div key={section.label}>
              <button
                onClick={() => toggleSection(section.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  hasActiveChild ? "text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{section.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {isOpen && (
                <div className="mt-1 ml-7 space-y-0.5 border-l border-zinc-800 pl-3">
                  {section.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={onClose}
                      className={`block px-2 py-1.5 rounded-md text-xs transition-colors ${
                        isActive(child.path)
                          ? "text-white bg-zinc-800"
                          : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800/50 p-2 space-y-1 flex-shrink-0">

        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
          {!collapsed && (
            <>
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
              </div>
            </>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ collapsed, onToggleCollapse }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent onClose={() => setMobileOpen(false)} collapsed={false} />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div className={`fixed inset-y-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
          <SidebarContent collapsed={collapsed} />
          {/* Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-16 z-10 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            {collapsed
              ? <PanelLeftOpen className="w-3 h-3" />
              : <PanelLeftClose className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;