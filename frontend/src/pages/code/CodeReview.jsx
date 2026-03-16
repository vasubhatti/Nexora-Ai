import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";
import { ShieldAlert, Lightbulb, ThumbsUp } from "lucide-react";

const severityColor = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
};

const CodeReview = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchBalance } = useCreditStore();

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await api.post("/code/review", { code, language });
      setResult(data.data.result);
      setMeta({ creditsUsed: data.data.creditsUsed, remainingCredits: data.data.remainingCredits });
      fetchBalance();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <AIToolLayout title="Code Review" description="Get a detailed review of your code." cost="4 credits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Your code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code for review..."
              rows={6}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Language (optional)
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. JavaScript"
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Reviewing..." />
            ) : (
              "Review Code"
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {result && typeof result === "object" && (
            <div className="space-y-3">
              {/* Score */}
              <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Code Quality Score</p>
                  <p className="text-sm text-gray-200">{result.summary}</p>
                </div>
                <div className={`text-3xl font-bold mr-2 ${
                  result.score >= 80 ? "text-green-400" :
                  result.score >= 60 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {result.score}
                </div>
              </div>

              {/* Issues */}
              {result.issues?.length > 0 && (
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    Issues ({result.issues.length})
                  </h3>
                  <div className="space-y-2">
                    {result.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`text-xs font-semibold uppercase mt-0.5 ${severityColor[issue.severity] || "text-gray-400"}`}>
                          {issue.severity}
                        </span>
                        <p className="text-sm text-gray-300">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                    Suggestions
                  </h3>
                  <ul className="space-y-1">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Positives */}
              {result.positives?.length > 0 && (
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-3.5 h-3.5 text-green-400" />
                    What's Good
                  </h3>
                  <ul className="space-y-1">
                    {result.positives.map((p, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <CreditBadge {...meta} />
        </div>
      </AIToolLayout>
    </Layout>
  );
};

export default CodeReview;