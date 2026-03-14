import { useState, useEffect } from "react";
import { Users, Zap, BarChart3, TrendingUp, UserCheck, UserX, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "../components/AdminLayout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import api from "../../api/axios.js";

const StatCard = ({ label, value, icon: Icon, sub, badge }) => (
  <Card className="bg-zinc-900 border-zinc-800 p-5 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <Icon className="w-4 h-4 text-zinc-600" />
    </div>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-bold text-white">{value?.toLocaleString?.() ?? value}</p>
      {badge && (
        <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-[10px]">
          {badge}
        </Badge>
      )}
    </div>
    {sub && <p className="text-[11px] text-zinc-600">{sub}</p>}
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              Overview
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm">Platform-wide statistics</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Main stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Total Users"
                value={stats?.totalUsers}
                icon={Users}
                sub="all registered"
              />
              <StatCard
                label="Active Users"
                value={stats?.activeUsers}
                icon={UserCheck}
                sub="not banned"
              />
              <StatCard
                label="Banned Users"
                value={stats?.bannedUsers}
                icon={UserX}
                sub="suspended accounts"
              />
              <StatCard
                label="Total Generations"
                value={stats?.totalGenerations}
                icon={BarChart3}
                sub="all time"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <StatCard
                label="Credits Used"
                value={stats?.totalCreditsUsed}
                icon={Zap}
                sub="all time across users"
              />
              <StatCard
                label="New Users Today"
                value={stats?.newUsersToday}
                icon={TrendingUp}
                sub="registered today"
              />
              <StatCard
                label="Generations Today"
                value={stats?.generationsToday}
                icon={Activity}
                sub="created today"
              />
            </div>

            {/* Subscription breakdown */}
            <Card className="bg-zinc-900 border-zinc-800 p-5">
              <h2 className="text-sm font-semibold text-white mb-4">
                Subscription Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Free", key: "free", total: stats?.totalUsers },
                  { label: "Pro", key: "pro", total: stats?.totalUsers },
                  { label: "Enterprise", key: "enterprise", total: stats?.totalUsers },
                ].map((plan) => {
                  const count = stats?.subscriptions?.[plan.key] || 0;
                  const pct = plan.total ? Math.round((count / plan.total) * 100) : 0;
                  return (
                    <div key={plan.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300 capitalize">{plan.label}</span>
                        <span className="text-zinc-500">
                          {count} users · {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5">
                        <div
                          className="bg-white h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;