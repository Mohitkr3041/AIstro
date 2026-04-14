import { useEffect, useMemo, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { askAstroChat, getChatHistory } from "../../services/chat.service";

const suggestions = [
  "What should I focus on this week?",
  "How can I improve my career direction?",
  "What relationship pattern should I notice?",
  "Give me one practical remedy for today.",
];

function ChatBox({ birthData }) {
  const messagesEndRef = useRef(null);
  const welcomeMessage = useMemo(() => ({
    text: `Hello ${birthData?.name || "friend"}, ask me anything about your chart.`,
    sender: "ai",
  }), [birthData?.name]);

  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        setHistoryError("");
        const res = await getChatHistory();
        const savedMessages = res.data.data || [];

        if (!isMounted) {
          return;
        }

        setMessages(savedMessages.length ? savedMessages : [welcomeMessage]);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMessages([welcomeMessage]);
        setHistoryError(error.response?.data?.message || "Could not load chat history.");
      } finally {
        if (isMounted) {
          setLoadingHistory(false);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (userMessage) => {
    const updatedMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(updatedMessages);

    try {
      setLoading(true);
      const res = await askAstroChat(userMessage);
      const savedMessages = res.data.data;

      setMessages(
        Array.isArray(savedMessages) && savedMessages.length
          ? [...messages, ...savedMessages]
          : [...updatedMessages, { text: res.data.reply, sender: "ai" }]
      );
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          text:
            error.response?.data?.message ||
            "Sorry, I could not answer right now.",
          sender: "ai",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.06] p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Astro AI</p>
          <h2 className="mt-1 text-2xl font-bold">Chat with your chart</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
            Ask about career, relationships, money, mindset, timing, or what to focus on next.
          </p>
        </div>
        <div className="w-fit rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/65">
          {messages.filter((msg) => msg.sender === "user").length} saved questions
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSend(suggestion)}
            disabled={loading || loadingHistory}
            className="shrink-0 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white/75 transition hover:border-teal-300/60 hover:text-white disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="min-w-0 rounded-lg border border-white/12 bg-black/25 p-3 sm:p-4">
        <div className="mb-4 max-h-[24rem] space-y-3 overflow-y-auto pr-1 sm:max-h-[28rem] sm:pr-2">
          {loadingHistory && (
            <p className="text-sm text-gray-300">Loading chat history...</p>
          )}

          {historyError && (
            <div className="rounded-lg border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {historyError}
            </div>
          )}

          {messages.map((msg, index) => (
            <Message key={msg.id || index} text={msg.text} sender={msg.sender} />
          ))}

          {loading && (
            <Message text="Reading the pattern and shaping a reply..." sender="ai" />
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSend} loading={loading || loadingHistory} />
      </div>
    </section>
  );
}

export default ChatBox;
