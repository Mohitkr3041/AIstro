import { useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { askAstroChat } from "../../services/chat.service";

function ChatBox({ birthData }) {
  const [messages, setMessages] = useState([
    {
      text: `Hello ${birthData?.name || "friend"}, ask me anything about your chart.`,
      sender: "ai",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (userMessage) => {
    const updatedMessages = [
      ...messages,
      { text: userMessage, sender: "user" },
    ];
    setMessages(updatedMessages);

    try {
      setLoading(true);
      const res = await askAstroChat(userMessage);

      setMessages([
        ...updatedMessages,
        { text: res.data.reply, sender: "ai" },
      ]);
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
          {messages.map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} />
          ))}
        </div>

        <ChatInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}

export default ChatBox;