import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CodeBlock from "@/components/common/CodeBlock.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";
import { Bug, Wrench, FileText } from "lucide-react";

const CodeDebugger = () => {
  const [form, setForm] = useState({ code: "", errorMessage: "", language: "" });
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchBalance } = useCreditStore();

  const handleSubmit = async () => {
    if (!form.code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await api.post("/code/debug", form);
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
      <AIToolLayout title="Code Debugger" description="Find and fix bugs in your code." cost="4 credits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Paste your buggy code
            </label>
            <textarea
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="Paste your code here..."
              rows={6}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Error Message (optional)
              </label>
              <input
                type="text"
                value={form.errorMessage}
                onChange={(e) => setForm({ ...form, errorMessage: e.target.value })}
                placeholder="e.g. TypeError: cannot read property..."
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Language (optional)
              </label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                placeholder="e.g. JavaScript"
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.code?.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Debugging..." />
            ) : (
              "Debug Code"
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Structured debug result */}
          {result && typeof result === "object" && (
            <div className="space-y-3">
              <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
                  <Bug className="w-3.5 h-3.5 text-red-400" />
                  Issue Found
                </h3>
                <p className="text-sm text-red-300">{result.issue}</p>
              </div>

              <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-green-400" />
                  Fixed Code
                </h3>
                <pre className="text-xs text-gray-200 bg-zinc-950 p-3 rounded-lg overflow-x-auto border border-gray-700 font-mono">
                
                  <ResultBox result={result.fixedCode} /> {/*For better formatting if it's a long code block*/}
                  
                  
                </pre>
              </div>

              {result.explanation && (
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    Explanation
                  </h3>
                  <p className="text-sm text-gray-300">{result.explanation}</p>
                </div>
              )}
            </div>
          )}

          {result && typeof result === "string" && <ResultBox result={result} />}
          <CreditBadge {...meta} />
        </div>
      </AIToolLayout>
    </Layout>
  );
};

export default CodeDebugger;