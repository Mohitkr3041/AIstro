import { useState } from "react";

function ChatInput({ onSend, loading, activeModeLabel = "Reading" }) {
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
        placeholder={`Ask about ${activeModeLabel.toLowerCase()}...`}
        value={message}
        maxLength={1000}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 rounded-lg border border-[#d8d1c3] bg-white px-4 py-3 text-[#1f2937] outline-none transition placeholder:text-[#8b8174] focus:border-[#2f8f83] focus:ring-4 focus:ring-[#2f8f83]/15"
      />
      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className="rounded-lg bg-[#e86f61] px-5 py-3 font-black text-white shadow-lg shadow-[#e86f61]/20 transition hover:bg-[#d85d50] disabled:opacity-60"
      >
        {loading ? "Reading..." : "Ask"}
      </button>
    </div>
  );
}

export default ChatInput;
