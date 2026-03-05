import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";
import { CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

const GrammarCheck = () => {
  const [text, setText] = useState("");
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
      const { data } = await api.post("/text/grammar", { text });
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
      <AIToolLayout title="Grammar Check" description="Fix grammar and spelling errors." cost="1 credit">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Your text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text to check for grammar errors..."
              rows={5}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors"
            />
          </div>

          
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Checking Grammar..." />
            ) : (
              "Check Grammar"
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              {/* Corrected text */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  Corrected Text
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {result.correctedText}
                </p>
              </div>

              {/* Errors */}
              {result.errors?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    Errors Found ({result.errors.length})
                  </h3>
                  <ul className="space-y-1">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                    Suggestions
                  </h3>
                  <ul className="space-y-1">
                    {result.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-yellow-200 flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span>
                        {imp}
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

export default GrammarCheck;