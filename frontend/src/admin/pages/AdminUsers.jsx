import { useState, useEffect } from "react";
import {
  Search, Ban, Trash2, ChevronDown, ChevronUp,
  Plus, Minus, ShieldCheck, User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "../components/AdminLayout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import api from "../../api/axios.js";

const subColors = {
  free: "border-zinc-700 text-zinc-400",
  pro: "border-blue-700 text-blue-400",
  enterprise: "border-purple-700 text-purple-400",
};

const UserRow = ({ user, onBan, onDelete, onCredits }) => {
  const [expanded, setExpanded] = useState(false);
  const [creditForm, setCreditForm] = useState({ amount: "", type: "add", reason: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleCredits = async () => {
    if (!creditForm.amount) return;
    setLoading(true);
    setMsg(null);
    try {
      await onCredits(user._id, creditForm);
      setMsg({ type: "success", text: "Credits updated." });
      setCreditForm({ amount: "", type: "add", reason: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-zinc-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            {user.role === "admin" && (
              <Badge variant="outline" className="border-yellow-700 text-yellow-400 text-[10px] h-4">
                Admin
              </Badge>
            )}
            {user.isBanned && (
              <Badge variant="outline" className="border-red-700 text-red-400 text-[10px] h-4">
                Banned
              </Badge>
            )}
            <Badge variant="outline" className={`text-[10px] h-4 capitalize ${subColors[user.subscription]}`}>
              {user.subscription}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
        </div>

        {/* Credits */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-sm font-medium text-white">{user.creditBalance}</p>
          <p className="text-[10px] text-zinc-600">credits</p>
        </div>

        {/* Expand */}
        {expanded
          ? <ChevronUp className="w-4 h-4 text-zinc-600 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-zinc-600 flex-shrink-0" />
        }
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-zinc-800 p-4 space-y-4">
          {/* User details */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { label: "Credits Left", value: user.creditBalance },
              { label: "Credits Used", value: user.creditsUsed },
              { label: "Plan", value: user.subscription },
              { label: "Joined", value: new Date(user.createdAt).toLocaleDateString() },
            ].map((item) => (
              <div key={item.label} className="bg-zinc-950 rounded-lg p-3">
                <p className="text-zinc-500 mb-1">{item.label}</p>
                <p className="text-white font-medium capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          <Separator className="bg-zinc-800" />

          {/* Credit management */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Manage Credits
            </p>

            {msg && (
              <p className={`text-xs ${msg.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {msg.text}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              <div className="flex rounded-lg overflow-hidden border border-zinc-800">
                <button
                  onClick={() => setCreditForm({ ...creditForm, type: "add" })}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                    creditForm.type === "add"
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
                <button
                  onClick={() => setCreditForm({ ...creditForm, type: "deduct" })}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                    creditForm.type === "deduct"
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Minus className="w-3 h-3" /> Deduct
                </button>
              </div>

              <Input
                type="number"
                value={creditForm.amount}
                onChange={(e) => setCreditForm({ ...creditForm, amount: e.target.value })}
                placeholder="Amount"
                className="w-28 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-zinc-600"
              />

              <Input
                value={creditForm.reason}
                onChange={(e) => setCreditForm({ ...creditForm, reason: e.target.value })}
                placeholder="Reason (optional)"
                className="flex-1 min-w-32 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-zinc-600"
              />

              <Button
                onClick={handleCredits}
                disabled={loading || !creditForm.amount}
                className="h-9 bg-white text-black hover:bg-zinc-200 text-xs font-medium disabled:opacity-40"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Apply"}
              </Button>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => onBan(user._id, user.isBanned)}
              variant="outline"
              className="h-8 text-xs border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              {user.isBanned ? "Unban User" : "Ban User"}
            </Button>

            {user.role !== "admin" && (
              <Button
                onClick={() => onDelete(user._id, user.name)}
                variant="outline"
                className="h-8 text-xs border-red-900 bg-transparent text-red-400 hover:bg-red-950 hover:text-red-300 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete User
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subscription, setSubscription] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append("search", search);
      if (subscription) params.append("subscription", subscription);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, subscription]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleBan = async (userId, isBanned) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/ban`);
      setActionMsg({ type: "success", text: data.message });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBanned: !isBanned } : u
        )
      );
    } catch (err) {
      setActionMsg({ type: "error", text: "Action failed." });
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setActionMsg({ type: "success", text: `${name} deleted.` });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setActionMsg({ type: "error", text: "Delete failed." });
    }
  };

  const handleCredits = async (userId, creditForm) => {
    await api.post(`/admin/users/${userId}/credits`, {
      amount: creditForm.amount,
      type: creditForm.type,
      reason: creditForm.reason,
    });
    fetchUsers();
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-zinc-500 text-sm">
            {pagination?.total || 0} total users
          </p>
        </div>

        {actionMsg && (
          <div className={`p-3 rounded-lg border text-sm ${
            actionMsg.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {actionMsg.text}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <form onSubmit={handleSearch} className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
            />
          </form>
          <select
            value={subscription}
            onChange={(e) => { setSubscription(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        {/* Users list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm">No users found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                onBan={handleBan}
                onDelete={handleDelete}
                onCredits={handleCredits}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 h-9 text-xs"
            >
              Previous
            </Button>
            <span className="text-sm text-zinc-500">
              {page} / {pagination.pages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              variant="outline"
              className="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 h-9 text-xs"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;