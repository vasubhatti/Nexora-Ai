import { useNavigate } from "react-router-dom";
import {
  MessageSquare, Code, Image, FileText,
  ScanText, ArrowRight, Zap, TrendingUp,
  Clock, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "../../store/authStore.js";
import useCreditStore from "../../store/creditStore.js";
import Layout from "../../components/common/Layout.jsx";

const tools = [
  {
    icon: MessageSquare,
    label: "Chat with AI",
    description: "Ask anything and get intelligent answers",
    path: "/chat",
    badge: "2 cr",
    tag: "Popular",
  },
  {
    icon: Code,
    label: "Code Tools",
    description: "Generate, debug, review and convert code",
    path: "/code/generate",
    badge: "4-5 cr",
    tag: "Dev",
  },
  {
    icon: Image,
    label: "Image Generation",
    description: "Create stunning images from text prompts",
    path: "/image/generate",
    badge: "10 cr",
    tag: "Creative",
  },
  {
    icon: FileText,
    label: "Document Analysis",
    description: "Summarize and query your documents",
    path: "/document/summarize",
    badge: "5 cr",
    tag: "Docs",
  },
];

const quickActions = [
  { label: "New Chat", path: "/chat", icon: MessageSquare },
  { label: "Generate Code", path: "/code/generate", icon: Code },
  { label: "Summarize Doc", path: "/document/summarize", icon: FileText },
  { label: "Create Image", path: "/image/generate", icon: Image },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { creditBalance, creditsUsed, creditsResetDate, subscription } = useCreditStore();

  const firstName = user?.name?.split(" ")[0];
  const resetDate = creditsResetDate
    ? new Date(creditsResetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const totalCredits = subscription === "pro" ? 1000 : subscription === "enterprise" ? 10000 : 100;
  const creditPercent = Math.min((creditBalance / totalCredits) * 100, 100);

  return (
    <Layout>
      <div className="p-4 lg:p-5 max-w-5xl mx-auto space-y-6 pt-14 lg:pt-5">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              Dashboard
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
            Good to see you, {firstName}
          </h1>
          <p className="text-zinc-500 text-sm">
            What would you like to create today?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Credits Left",
              value: creditBalance,
              icon: Zap,
              sub: `of ${totalCredits}`,
            },
            {
              label: "Credits Used",
              value: creditsUsed,
              icon: TrendingUp,
              sub: "this month",
            },
            {
              label: "Resets On",
              value: resetDate,
              icon: Clock,
              sub: "next reset",
            },
            {
              label: "Plan",
              value: subscription,
              icon: Sparkles,
              sub: "current plan",
              capitalize: true,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="bg-zinc-900 border-zinc-800 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                  <Icon className="w-3.5 h-3.5 text-zinc-600" />
                </div>
                <p className={`text-xl font-semibold text-white ${stat.capitalize ? "capitalize" : ""}`}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-zinc-600">{stat.sub}</p>
              </Card>
            );
          })}
        </div>

        {/* Credit bar */}
        <Card className="bg-zinc-900 border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-400">Credit Usage</span>
            <span className="text-xs text-zinc-500">
              {creditBalance} / {totalCredits} remaining
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5">
            <div
              className="bg-white h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${creditPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-zinc-600">0</span>
            <span className="text-[10px] text-zinc-600">{totalCredits}</span>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-2.5 p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" />
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors truncate">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator className="bg-zinc-800/50" />

        {/* AI Tools */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
            All Tools
          </h2>
          <div className="space-y-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.path}
                  onClick={() => navigate(tool.path)}
                  className="w-full flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all group text-left"
                >
                  <div className="w-9 h-9 bg-zinc-800 group-hover:bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border border-zinc-700">
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-white">{tool.label}</p>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 border-zinc-700 text-zinc-500 hidden sm:flex"
                      >
                        {tool.tag}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-zinc-600 hidden sm:block">{tool.badge}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;