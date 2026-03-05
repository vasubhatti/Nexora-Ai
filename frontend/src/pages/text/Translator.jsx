import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";

const languages = [
  "Spanish", "French", "German", "Italian", "Portuguese",
  "Chinese", "Japanese", "Korean", "Arabic", "Hindi",
  "Russian", "Dutch", "Swedish", "Turkish", "Polish",
];

const Translator = () => {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
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
      const { data } = await api.post("/text/translate", { text, targetLanguage });
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
      <AIToolLayout title="Translator" description="Translate text to any language." cost="3 credits">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Text to translate
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={4}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Translating..." />
            ) : (
              "Translate"
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

export default Translator;