import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const detectLanguage = (code) => {
  if (!code) return "javascript";
  if (code.includes("import ") && (code.includes("from ") || code.includes("React"))) return "jsx";
  if (code.includes("def ") && code.includes(":")) return "python";
  if (code.includes("public class") || code.includes("System.out")) return "java";
  if (code.includes("func ") && code.includes("fmt.")) return "go";
  if (code.includes("SELECT") || code.includes("FROM ")) return "sql";
  if (code.includes("<?php")) return "php";
  if (code.includes("<html") || code.includes("</div>")) return "html";
  if (code.includes("{") && (code.includes("margin") || code.includes("padding"))) return "css";
  if (code.includes("fn ") && code.includes("let mut")) return "rust";
  return "javascript";
};

// Compact = single or few lines, no full file structure
const isCompact = (code) => {
  const lines = code.trim().split("\n").length;
  const hasFileStructure =
    code.includes("import ") ||
    code.includes("function ") ||
    code.includes("class ") ||
    code.includes("export ") ||
    code.includes("def ") ||
    code.includes("public ");
  return lines <= 6 && !hasFileStructure;
};

const CodeBlock = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);
  const lang = language || detectLanguage(code);
  const codeStr = String(code).replace(/\n$/, "");
  const compact = isCompact(codeStr);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compact mode — no header bar, no line numbers, minimal padding
  if (compact) {
    return (
      <div className="relative group my-2 rounded-lg border border-zinc-800 overflow-hidden">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-200 bg-zinc-900/80 px-1.5 py-1 rounded"
        >
          {copied
            ? <><Check className="w-2.5 h-2.5 text-green-400" /><span className="text-green-400">Copied</span></>
            : <><Copy className="w-2.5 h-2.5" />Copy</>}
        </button>
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            padding: "0.6rem 0.9rem",
            background: "#0d0d0f",
            fontSize: "0.82rem",
            lineHeight: "1.6",
            borderRadius: 0,
          }}
          codeTagProps={{
            style: {
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            },
          }}
        >
          {codeStr}
        </SyntaxHighlighter>
      </div>
    );
  }

  // Full mode — header bar + line numbers + filename
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <span className="text-xs text-zinc-500 font-mono ml-2">
            {filename || lang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
        >
          {copied ? (
            <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></>
          ) : (
            <><Copy className="w-3 h-3" />Copy</>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        showLineNumbers
        lineNumberStyle={{
          color: "#3f3f46",
          fontSize: "0.75rem",
          paddingRight: "1.2rem",
          minWidth: "2.8rem",
          userSelect: "none",
        }}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "#0d0d0f",
          fontSize: "0.82rem",
          lineHeight: "1.65",
          borderRadius: 0,
        }}
        codeTagProps={{
          style: {
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          },
        }}
      >
        {codeStr}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;