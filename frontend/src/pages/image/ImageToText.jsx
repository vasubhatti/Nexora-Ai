import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";

const tools = [
  { id: "describe", label: "Describe Image", endpoint: "/image-to-text/describe", cost: "4 credits" },
  { id: "ocr", label: "Extract Text (OCR)", endpoint: "/image-to-text/ocr", cost: "4 credits" },
  { id: "detect", label: "Detect Objects", endpoint: "/image-to-text/detect", cost: "5 credits" },
  { id: "handwriting", label: "Handwriting", endpoint: "/image-to-text/handwriting", cost: "5 credits" },
  { id: "scan", label: "Scan Document", endpoint: "/image-to-text/scan", cost: "6 credits" },
];

const ImageToText = () => {
  const [activeTool, setActiveTool] = useState("describe");
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchBalance } = useCreditStore();

  const currentTool = tools.find((t) => t.id === activeTool);

  const handleSubmit = async () => {
    if (!imageUrl.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await api.post(currentTool.endpoint, { imageUrl });
      setResult(data.data.result);
      setMeta({
        creditsUsed: data.data.creditsUsed,
        remainingCredits: data.data.remainingCredits,
      });
      fetchBalance();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <AIToolLayout
        title="Image to Text"
        description="Analyze and extract information from images."
        cost=""
      >
        <div className="space-y-4">
          {/* Tool Selector */}
          <div className="flex gap-2 flex-wrap">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  setResult(null);
                  setError(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTool === tool.id
                    ? "bg-zinc-100 text-gray-900"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }`}
              >
                {tool.label}
                <span className="ml-1.5 text-gray-500">{tool.cost}</span>
              </button>
            ))}
          </div>

          {/* Image URL input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 transition-colors text-sm"
            />
          </div>

          {/* Image preview */}
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-700 max-h-48">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => e.target.style.display = "none"}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !imageUrl.trim()}
            className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <LoadingSpinner size="sm" /> : currentTool.label}
          </button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {result && Array.isArray(result) ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-3 uppercase font-semibold">Detected Objects</p>
              <div className="space-y-2">
                {result.map((obj, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-white font-medium">{obj.object}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">{obj.location}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">{obj.size}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ResultBox result={result} />
          )}

          <CreditBadge {...meta} />
        </div>
      </AIToolLayout>
    </Layout>
  );
};

export default ImageToText;