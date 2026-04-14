import { useState } from "react";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Type your question..."
        value={message}
        maxLength={1000}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-lg bg-white/10 border border-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;
