import { useEffect, useMemo, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { askAstroChat, getChatHistory } from "../../services/chat.service";

const modes = [
  {
    id: "future",
    label: "Future",
    helper: "Timing, opportunity, warning",
    suggestions: [
      "Explain my next 30 days in simple words",
      "What should I avoid in the next 6 months?",
      "What is the best action for my future prediction?",
    ],
  },
  {
    id: "past",
    label: "Past",
    helper: "Validate what already happened",
    suggestions: [
      "Which past pattern is strongest in my chart?",
      "Explain my career or education past pattern",
      "What emotional pattern may have repeated before?",
    ],
  },
  {
    id: "career",
    label: "Career",
    helper: "Work, skill, direction",
    suggestions: [
      "Give me a career action plan from my report",
      "Which skills should I focus on now?",
      "Job or business: what suits my chart better?",
    ],
  },
  {
    id: "remedies",
    label: "Remedies",
    helper: "Daily actions and focus",
    suggestions: [
      "Turn my remedies into a daily routine",
      "What should I do today according to my chart?",
      "Explain my lucky factors practically",
    ],
  },
];

function ChatBox({ birthData }) {
  const messagesEndRef = useRef(null);
  const [activeMode, setActiveMode] = useState("future");
  const activeModeConfig = modes.find((mode) => mode.id === activeMode) || modes[0];
  const welcomeMessage = useMemo(() => ({
    text: `Hello ${birthData?.name || "friend"}, choose a focus above and I will explain your reading in a clearer way.`,
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
      const res = await askAstroChat(userMessage, activeMode);
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
    <section className="aistro-card min-w-0">
      <div className="border-b border-[rgba(212,175,55,0.14)] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="aistro-kicker">AIstro Companion</p>
            <h2 className="aistro-title mt-2 text-4xl">Ask About Your Reading</h2>
            <p className="aistro-muted mt-2 max-w-2xl text-sm italic leading-6">
              Use chat to understand the report, not replace it. Pick a focus and ask follow-up questions.
            </p>
          </div>
          <div className="aistro-chip w-fit">
            {messages.filter((msg) => msg.sender === "user").length} saved questions
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              className={`rounded-[6px] border p-3 text-left transition ${
                activeMode === mode.id
                  ? "border-[rgba(212,175,55,0.52)] bg-[rgba(155,89,182,0.3)] text-[var(--gold-2)]"
                  : "border-[rgba(212,175,55,0.16)] bg-black/25 text-[var(--parchment)] hover:border-[rgba(212,175,55,0.38)] hover:text-[var(--gold-2)]"
              }`}
            >
              <span className="block text-sm font-bold">{mode.label}</span>
              <span className="mt-1 block text-xs opacity-70">{mode.helper}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[6px] border border-[rgba(212,175,55,0.16)] bg-black/25 p-3">
          <p className="aistro-kicker mb-3 text-[10px]">
            Suggested questions for {activeModeConfig.label}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {activeModeConfig.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSend(suggestion)}
                disabled={loading || loadingHistory}
                className="shrink-0 rounded-[4px] border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.06)] px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:border-[rgba(212,175,55,0.5)] hover:text-[var(--gold-2)] disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 min-w-0 rounded-[6px] border border-[rgba(212,175,55,0.16)] bg-black/25 p-3 sm:p-4">
          <div className="mb-4 max-h-[24rem] space-y-3 overflow-y-auto pr-1 sm:max-h-[28rem] sm:pr-2">
            {loadingHistory && (
              <p className="aistro-muted text-sm">Loading chat history...</p>
            )}

            {historyError && (
              <div className="rounded-[4px] border border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.12)] px-4 py-3 text-sm text-[#ffc1ba]">
                {historyError}
              </div>
            )}

            {!loadingHistory && messages.length === 1 && (
              <div className="rounded-[6px] border border-[rgba(39,174,96,0.26)] bg-[rgba(39,174,96,0.08)] p-4">
                <p className="text-sm font-bold text-[#b9f6cb]">Start with a focused question</p>
                <p className="aistro-muted mt-1 text-sm leading-6">
                  Ask about future timing, past proof, career, or remedies.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <Message key={msg.id || index} text={msg.text} sender={msg.sender} />
            ))}

            {loading && (
              <Message text="Checking your saved reading and shaping a focused answer..." sender="ai" />
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            onSend={handleSend}
            loading={loading || loadingHistory}
            activeModeLabel={activeModeConfig.label}
          />
        </div>
      </div>
    </section>
  );
}

export default ChatBox;
