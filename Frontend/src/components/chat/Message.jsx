function Message({ text, sender = "ai" }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] break-words rounded-lg px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-xl ${
          isUser
            ? "bg-[#1e2a44] text-white"
            : "border border-[#ded6c8] bg-white text-[#1f2937]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;
