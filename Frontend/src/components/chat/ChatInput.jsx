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
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <input
        type="text"
        placeholder="Ask about this reading, timing, or remedies..."
        value={message}
        maxLength={1000}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 rounded-lg border border-white/15 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#5eead4] focus:ring-2 focus:ring-[#5eead4]/30"
      />
      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className="rounded-lg border border-[#f8d66d] bg-[#f8d66d] px-5 py-3 font-black text-[#171014] shadow-lg shadow-[#f8d66d]/10 transition hover:bg-[#ffe58a] disabled:opacity-60"
      >
        {loading ? "Reading..." : "Ask"}
      </button>
    </div>
  );
}

export default ChatInput;
