function Message({ text, sender = "ai" }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-xl ${
          isUser
            ? "bg-indigo-600 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;
