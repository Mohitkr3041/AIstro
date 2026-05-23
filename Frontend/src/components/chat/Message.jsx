function Message({ text, sender = "ai" }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] break-words rounded-[6px] px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-xl ${
          isUser
            ? "border border-[rgba(212,175,55,0.28)] bg-[rgba(155,89,182,0.32)] text-[var(--parchment)]"
            : "border border-[rgba(154,100,21,0.18)] bg-[rgba(255,252,245,0.8)] text-[var(--parchment)]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;
