"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const MOCK_RESPONSES = [
  "سلام! من **ChatGol** هستم 🤖\n\nیه هوش مصنوعی سبک و فارسی‌پسند. چطور می‌تونم کمکت کنم؟",
  "سوالت خیلی جالبه! بذار توضیح بدم...",
  "بله، کاملاً درسته. می‌تونی بیشتر در موردش بپرسی.",
  "برای این موضوع پیشنهاد می‌کنم این مراحل رو انجام بدی:\n\n1. اول تحقیق کن\n2. بعد برنامه‌ریزی کن\n3. و در نهایت اجرا کن",
  "متأسفانه اطلاعات دقیقی در مورد این موضوع ندارم، ولی می‌تونم کمکت کنم تا پیدا کنی.",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "سلام! من **ChatGol** هستم 🟢\n\nیه چت‌بات هوش مصنوعی سبک، سریع و کاملاً فارسی.\n\nهر سوالی داری بپرس!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatgol-messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch {}
    }
    const key = localStorage.getItem("chatgol-api-key");
    if (key) setApiKey(key);
  }, []);

  // Save messages
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("chatgol-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      // If user has API key, call real OpenAI
      if (apiKey.trim()) {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            apiKey: apiKey.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("خطا در ارتباط با API");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content || "پاسخی دریافت نشد.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Mock response for demo
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
        const randomResponse =
          MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: randomResponse,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "⚠️ متأسفانه خطایی رخ داد. لطفاً API Key رو بررسی کن یا بعداً دوباره امتحان کن.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "سلام! من **ChatGol** هستم 🟢\n\nچت پاک شد. چطور می‌تونم کمکت کنم؟",
      },
    ]);
    localStorage.removeItem("chatgol-messages");
  };

  const saveApiKey = () => {
    localStorage.setItem("chatgol-api-key", apiKey);
    setShowSettings(false);
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--card)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/20">
            G
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ChatGol</h1>
            <p className="text-xs text-[var(--muted)]">هوش مصنوعی فارسی</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--card-hover)] hover:bg-[#2a2a2a] transition-colors text-[var(--muted)] hover:text-white"
            title="پاک کردن چت"
          >
            پاک کردن
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--card-hover)] hover:bg-[#2a2a2a] transition-colors text-[var(--muted)] hover:text-white"
            title="تنظیمات"
          >
            تنظیمات
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-fade-in ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gradient-to-br from-emerald-500 to-green-700 text-white"
                }`}
              >
                {msg.role === "user" ? "ش" : "G"}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-7 whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-600 text-white rounded-tr-sm"
                    : "bg-[var(--assistant-bubble)] border border-[var(--border)] rounded-tl-sm"
                }`}
              >
                {msg.content.split("**").map((part, i) =>
                  i % 2 === 1 ? (
                    <strong key={i} className="font-semibold">
                      {part}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-sm font-bold text-white">
                G
              </div>
              <div className="bg-[var(--assistant-bubble)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full typing-dot"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full typing-dot"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-[var(--border)] bg-[var(--card)] p-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          {!apiKey && (
            <p className="text-xs text-center text-[var(--muted)] mb-2">
              در حال حاضر در حالت دمو هستی. برای پاسخ واقعی، API Key رو در تنظیمات وارد کن.
            </p>
          )}
          <div className="flex items-end gap-3 bg-[var(--background)] border border-[var(--border)] rounded-2xl px-4 py-3 focus-within:border-green-600 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="پیامت رو بنویس..."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-[15px] leading-6 max-h-[150px] placeholder:text-[var(--muted)]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:hover:bg-green-600 flex items-center justify-center transition-all shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white rotate-180"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-center text-[var(--muted)] mt-2">
            Enter برای ارسال · Shift+Enter برای خط جدید
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">تنظیمات</h2>

            <label className="block text-sm text-[var(--muted)] mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-green-600 transition-colors mb-2"
            />
            <p className="text-xs text-[var(--muted)] mb-6">
              کلید فقط روی دستگاه خودت ذخیره می‌شه و به سرور ما ارسال نمی‌شه.
            </p>

            <div className="flex gap-3">
              <button
                onClick={saveApiKey}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                ذخیره
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-[var(--card-hover)] hover:bg-[#2a2a2a] text-[var(--muted)] hover:text-white py-2.5 rounded-xl transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
