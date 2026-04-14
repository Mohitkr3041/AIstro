import { useEffect, useMemo, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { askAstroChat, getChatHistory } from "../../services/chat.service";

function ChatBox({ birthData }) {
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
    <div className="mt-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-3">Chat with Astro AI</h2>
      <p className="text-gray-300 mb-4">
        Ask about career, relationships, health, money, or your next steps.
      </p>

      <div className="rounded-xl border border-white/20 bg-black/20 p-4">
        <div className="mb-4 space-y-3 max-h-96 overflow-y-auto pr-2">
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
        </div>

        <ChatInput onSend={handleSend} loading={loading || loadingHistory} />
      </div>
    </div>
  );
}

export default ChatBox;
