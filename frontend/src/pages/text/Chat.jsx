import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Copy, Check } from "lucide-react";
import Layout from "../../components/common/Layout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import useCreditStore from "../../store/creditStore.js";
import api from "../../api/axios.js";
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../components/common/CodeBlock.jsx";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const Message = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`py-5 px-4 lg:px-6 ${isUser ? "bg-transparent" : "bg-zinc-900/40"}`}>
      <div className="max-w-3xl mx-auto">
        {/* Role label */}
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          {isUser ? "You" : "Nexora AI"}
        </p>

        {/* Content */}
        <div className="text-[17px] leading-8 text-zinc-100">
          {isUser ? (
            <p className="whitespace-pre-wrap text-[16.5px] leading-8">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-white mt-6 mb-3 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-white mt-5 mb-2 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold text-zinc-200 mt-4 mb-2 first:mt-0">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 last:mb-0 leading-7">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-zinc-300">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-zinc-200 leading-7">{children}</li>
                ),
                hr: () => <hr className="border-zinc-800 my-6" />,
                br: () => <br />,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline underline-offset-4 hover:text-zinc-300"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-zinc-600 pl-4 my-4 text-zinc-400 italic">
                    {children}
                  </blockquote>
                ),

                // --- Tables ---
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 rounded-xl border border-zinc-800">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-zinc-900">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-zinc-800">{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-zinc-900/50 transition-colors">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-zinc-300 leading-relaxed align-top">
                    {children}
                  </td>
                ),

                // --- Code ---
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
                    <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Copy button for AI messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            {copied ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy className="w-3 h-3" />Copy response</>}
          </button>
        )}
      </div>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const { fetchBalance } = useCreditStore();

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data } = await api.post("/text/chat", {
        message: userMessage.content,
        conversationHistory,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.data.result },
      ]);

      // Refresh credit balance
      fetchBalance();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      // Remove user message if request failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <Layout>
  <div className="flex flex-col h-screen bg-black text-white">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-white">Chat with AI</h1>
        <p className="text-xs text-zinc-400">2 credits per message</p>
      </div>
      {messages.length > 0 && (
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            How can I help you?
          </h2>
          <p className="text-zinc-500 text-sm max-w-sm">
            Ask me anything — coding, writing, analysis, math, or just a conversation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 w-full max-w-lg">
            {[
              "Explain how REST APIs work",
              "Write a Python fibonacci function",
              "What is machine learning?",
              "Help me write a professional email",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm text-zinc-300 text-left transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}

      {loading && (
      <div className="py-6 px-4 lg:px-8 bg-zinc-900/40">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Nexora AI
          </p>
          <LoadingSpinner size="sm" text="Thinking..." />
        </div>
      </div>
    )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>

    {/* Input area */}
    <div className="border-t border-zinc-800/50 bg-black px-4 py-3 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-zinc-600 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nexora AI..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder:text-zinc-600 text-sm resize-none focus:outline-none leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-8 h-8 bg-white hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          >
            {/* Arrow up icon */}
            <svg
              className="w-4 h-4 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
              />
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-zinc-700 text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  </div>
</Layout>
  );
};

export default Chat;