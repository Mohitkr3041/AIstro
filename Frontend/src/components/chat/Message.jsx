function Message({ text, sender = "ai" }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] break-words rounded-lg px-4 py-3 text-sm leading-6 shadow-lg sm:max-w-xl ${
          isUser
            ? "border border-[#f8d66d] bg-[#f8d66d] text-[#171014] shadow-[#f8d66d]/10"
            : "border border-white/10 bg-[#171014] text-[#f4f0ea] shadow-black/20"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;
