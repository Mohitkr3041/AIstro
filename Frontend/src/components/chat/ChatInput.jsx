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
        className="aistro-input min-w-0"
      />
      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className="aistro-button-primary"
      >
        {loading ? "Reading" : "Ask"}
      </button>
    </div>
  );
}

export default ChatInput;
