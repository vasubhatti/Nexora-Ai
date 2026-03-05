import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";

const languages = [
  "JavaScript", "TypeScript", "Python", "Java", "C++",
  "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
];

const CodeGenerator = () => {
  const [form, setForm] = useState({ prompt: "", language: "JavaScript" });
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchBalance } = useCreditStore();

  const handleSubmit = async () => {
    if (!form.prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await api.post("/code/generate", {
        prompt: form.prompt,
        language: form.language,
      });
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
      <AIToolLayout title="Code Generator" description="Generate clean code from description." cost="5 credits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Describe what you want to build
            </label>
            <textarea
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              placeholder="e.g. Create a function that validates email addresses using regex"
              rows={4}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Language
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setForm({ ...form, language: lang })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium bg-white text-black ${
                    form.language === lang
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.prompt?.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Generating..." />
            ) : (
              "Generate"
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

export default CodeGenerator;