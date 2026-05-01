import { useEffect, useMemo, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { askAstroChat, getChatHistory } from "../../services/chat.service";

const suggestions = [
  "Explain my next 30 days from this chart",
  "Which past pattern should I pay attention to?",
  "Give me a career action plan from my report",
  "Turn my remedies into a daily routine",
];

function ChatBox({ birthData }) {
  const messagesEndRef = useRef(null);
  const welcomeMessage = useMemo(() => ({
    text: `Hello ${birthData?.name || "friend"}, ask me to explain any part of your reading.`,
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
    <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#171014] shadow-2xl shadow-black/25">
      <div className="border-b border-white/10 bg-black/20 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5eead4]">AIstro companion</p>
            <h2 className="mt-2 text-2xl font-black text-white">Ask deeper about this reading</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              This is the support layer: users can ask why, timing, remedies, or how to act on a prediction.
            </p>
          </div>
          <div className="w-fit rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2 text-sm font-bold text-white/65">
            {messages.filter((msg) => msg.sender === "user").length} saved questions
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSend(suggestion)}
              disabled={loading || loadingHistory}
              className="shrink-0 rounded-lg border border-white/12 bg-white/[0.055] px-3 py-2 text-sm font-bold text-white/75 transition hover:border-[#5eead4]/70 hover:bg-[#5eead4]/10 hover:text-white disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="min-w-0 rounded-lg border border-white/10 bg-black/25 p-3 sm:p-4">
          <div className="mb-4 max-h-[24rem] space-y-3 overflow-y-auto pr-1 sm:max-h-[28rem] sm:pr-2">
            {loadingHistory && (
              <p className="text-sm text-white/60">Loading chat history...</p>
            )}

            {historyError && (
              <div className="rounded-lg border border-[#ff7a7a]/40 bg-[#ff7a7a]/10 px-4 py-3 text-sm text-red-100">
                {historyError}
              </div>
            )}

            {messages.map((msg, index) => (
              <Message key={msg.id || index} text={msg.text} sender={msg.sender} />
            ))}

            {loading && (
              <Message text="Reading the chart context and shaping a reply..." sender="ai" />
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={handleSend} loading={loading || loadingHistory} />
        </div>
      </div>
    </section>
  );
}

export default ChatBox;
