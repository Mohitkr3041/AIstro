function Message({ text, sender = "ai" }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white/10 text-gray-100 border border-white/10"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;