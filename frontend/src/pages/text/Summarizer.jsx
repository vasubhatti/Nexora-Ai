import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("paragraph");
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchBalance } = useCreditStore();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await api.post("/text/summarize", { text, style });
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
      <AIToolLayout title="Summarizer" description="Summarize any text instantly." cost="3 credits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Paste your text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the text you want to summarize..."
              rows={6}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Style</label>
            <div className="flex gap-3">
              {["paragraph", "bullet"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`className="px-3 py-1.5 rounded-md text-xs capitalize font-medium bg-white text-black" ${
                    style === s
                      ? "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

           <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Summarizing..." />
            ) : (
              "Summarize"
            )}
          </button>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <ResultBox result={result} />
          <CreditBadge {...meta} />
        </div>
      </AIToolLayout>
    </Layout>
  );
};

export default Summarizer;