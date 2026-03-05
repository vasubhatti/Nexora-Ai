import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";

const CodeDocumentation = () => {
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
      const { data } = await api.post("/code/document", { code, language });
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
      <AIToolLayout title="Code Documentation" description="Generate docs for your code." cost="3 credits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Your code</label>
            <textarea value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code to document..." rows={6}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Language (optional)</label>
            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. JavaScript"
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm transition-colors" />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Generating..." />
            ) : (
              "Generate"
            )}
          </button>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400 text-sm">{error}</p></div>}
          <ResultBox result={result} />
          <CreditBadge {...meta} />
        </div>
      </AIToolLayout>
    </Layout>
  );
};

export default CodeDocumentation;