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
    <div className="grid gap-3 sm:flex">
      <input
        type="text"
        placeholder="Type your question..."
        value={message}
        maxLength={1000}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-300"
      />
      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className="rounded-lg bg-teal-300 px-5 py-3 font-semibold text-black disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;

