import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import api from "../../api/axios.js";
import { Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";

const typeColors = {
  CHAT: "bg-blue-500/10 text-blue-400",
  CODE_GENERATION: "bg-green-500/10 text-green-400",
  CODE_DEBUGGING: "bg-red-500/10 text-red-400",
  CODE_REVIEW: "bg-yellow-500/10 text-yellow-400",
  IMAGE_GENERATION: "bg-purple-500/10 text-purple-400",
  SUMMARIZATION: "bg-zinc-500/10 text-zinc-400",
  TRANSLATION: "bg-indigo-500/10 text-indigo-400",
  DOCUMENT_QA: "bg-orange-500/10 text-orange-400",
};

const HistoryItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900 border border-gray-800 rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${typeColors[item.type] || "bg-gray-700 text-gray-300"}`}>
          {item.type.replace(/_/g, " ")}
        </span>
        <p className="text-sm text-gray-300 flex-1 truncate">{item.prompt}</p>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {item.creditsUsed} cr
        </span>
        <span className="text-xs text-gray-600 flex-shrink-0">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
          className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
        }
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <p className="text-xs text-gray-400 mb-1">Prompt</p>
          <p className="text-sm text-gray-300 mb-3">{item.prompt}</p>
          <p className="text-xs text-gray-400 mb-1">Result</p>
          <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-6">
            {typeof item.result === "string" ? item.result : JSON.stringify(item.result, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
};

const History = () => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append("search", search);
      if (typeFilter) params.append("type", typeFilter);

      const { data } = await api.get(`/generations?${params}`);
      setGenerations(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/generations/${id}`);
      setGenerations((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const types = [
    "CHAT", "CONTENT_GENERATION", "SUMMARIZATION", "TRANSLATION",
    "GRAMMAR_CHECK", "CODE_GENERATION", "CODE_DEBUGGING", "CODE_REVIEW",
    "IMAGE_GENERATION", "DOCUMENT_QA", "PDF_EXTRACTION",
  ];

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Generation History</h1>
          <p className="text-gray-400 text-sm mt-1">All your previous AI generations</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by prompt..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 text-sm"
            />
          </form>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-zinc-400 text-sm"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No generations found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {generations.map((item) => (
              <HistoryItem key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-zinc-800 border border-gray-700 rounded-lg text-sm text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              {page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-3 py-1.5 bg-zinc-800 border border-gray-700 rounded-lg text-sm text-gray-300 disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;