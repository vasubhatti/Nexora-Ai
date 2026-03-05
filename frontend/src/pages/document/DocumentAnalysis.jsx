import { useState } from "react";
import Layout from "../../components/common/Layout.jsx";
import AIToolLayout from "../../components/common/AIToolLayout.jsx";
import ResultBox from "../../components/common/ResultBox.jsx";
import CreditBadge from "../../components/common/CreditBadge.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";
import { Upload, FileText, X } from "lucide-react";

const tools = [
  { id: "extract", label: "Extract Text", endpoint: "/document/extract", cost: "5 credits" },
  { id: "summarize", label: "Summarize", endpoint: "/document/summarize", cost: "5 credits" },
  { id: "keypoints", label: "Key Points", endpoint: "/document/keypoints", cost: "4 credits" },
  { id: "qa", label: "Ask Question", endpoint: "/document/qa", cost: "5 credits" },
];

const DocumentAnalysis = () => {
  const [activeTool, setActiveTool] = useState("extract");
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchBalance } = useCreditStore();

  const currentTool = tools.find((t) => t.id === activeTool);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("document", file);
      if (activeTool === "qa" && question) {
        formData.append("question", question);
      }

      const { data } = await api.post(currentTool.endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
        title="Document Analysis"
        description="Upload a PDF or DOC and analyze it."
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium  ${
                  activeTool === tool.id
                    ? "bg-white text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                }`}
              >
                {tool.label}
                <span className="ml-1.5 text-gray-500">{tool.cost}</span>
              </button>
            ))}
          </div>

          {/* File Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative"
          >
            {file ? (
             <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <FileText className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => { setFile(null); setResult(null); }}
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-10 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/80 transition-all">
                  <Upload className="w-8 h-8 text-zinc-600 mb-3" />
                  <p className="text-sm text-zinc-300 font-medium">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    PDF, DOC, DOCX, TXT up to 10MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
              </label>
            )}
          </div>

          {/* Question input for QA mode */}
          {activeTool === "qa" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Your Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What is the main conclusion of this document?"
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 text-sm transition-colors"
              />
            </div>
          )}

         
            <button
              onClick={handleSubmit}
              disabled={loading || !file || (activeTool === "qa" && !question.trim())}
              className="w-full py-2.5 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <LoadingSpinner size="sm" text="Analyzing document..." />
              ) : (
                "Generate"
              )}
            </button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Key points structured result */}
          {result && activeTool === "keypoints" && typeof result === "object" && (
            <div className="space-y-3">
              {result.title && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Document Title</p>
                  <p className="text-sm font-semibold text-white">{result.title}</p>
                </div>
              )}
              {result.mainTheme && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Main Theme</p>
                  <p className="text-sm text-gray-200">{result.mainTheme}</p>
                </div>
              )}
              {result.keyPoints?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2">Key Points</p>
                  <ul className="space-y-1.5">
                    {result.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm text-gray-200 flex items-start gap-2">
                        <span className="text-zinc-400 font-semibold mt-0.5">{i + 1}.</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.conclusion && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Conclusion</p>
                  <p className="text-sm text-gray-200">{result.conclusion}</p>
                </div>
              )}
            </div>
          )}

          {/* Regular text result */}
          {result && (activeTool !== "keypoints" || typeof result === "string") && (
            <ResultBox result={typeof result === "string" ? result : JSON.stringify(result, null, 2)} />
          )}

          <CreditBadge {...meta} />
        </div>
      </AIToolLayout>
    </Layout>
  );
};

export default DocumentAnalysis;