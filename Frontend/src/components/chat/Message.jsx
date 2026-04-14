function Message({ text, sender = "ai" }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] break-words rounded-lg sm:max-w-xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-teal-300 text-black"
            : "bg-white/10 text-gray-100 border border-white/10"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;
