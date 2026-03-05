import { useState } from "react";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock.jsx";  
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const ResultBox = ({ result, isJson = false }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    const text = isJson ? JSON.stringify(result, null, 2) : result;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <span className="text-xs font-medium text-gray-400">Result</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>
      <div className="p-4 text-sm text-gray-200 leading-relaxed overflow-x-auto">
        {isJson ? (
          <pre className="text-xs text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]} 
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-3 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold text-white mt-3 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold text-zinc-200 mt-2 mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 pl-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 pl-2">{children}</ol>,
              li: ({ children }) => <li className="text-gray-200">{children}</li>,
              code({ inline, className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                const codeString = String(children).replace(/\n$/, "");

                if (!inline) {
                  return (
                    <CodeBlock
                      code={codeString}
                      language={match ? match[1] : undefined}
                    />
                  );
                }

                return (
                  <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                );
              },
              pre({ children }) {
                return <>{children}</>;
              },
                        table: ({ children }) => (
                <div className="overflow-x-auto my-4 rounded-xl border border-zinc-800">
                  <table className="w-full text-sm border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-zinc-900">{children}</thead>,
              tbody: ({ children }) => <tbody className="divide-y divide-zinc-800">{children}</tbody>,
              tr: ({ children }) => <tr className="hover:bg-zinc-900/50 transition-colors">{children}</tr>,
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-zinc-300 leading-relaxed align-top">{children}</td>
              ),
              br: () => <br />,
            }}
          >
            {result}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ResultBox;