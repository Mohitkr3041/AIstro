function Card({ title, children, titleColor = "text-indigo-300" }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
      <h3 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h3>
      {children}
    </div>
  );
}

export default Card;