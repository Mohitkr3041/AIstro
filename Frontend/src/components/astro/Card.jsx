function Card({ title, children, accent = "border-teal-300/50", eyebrow }) {
  return (
    <section className={`h-full min-w-0 rounded-lg border ${accent} bg-white/[0.07] p-4 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/[0.09] sm:p-5`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
          {eyebrow}
        </p>
      )}
      <h3 className="mb-4 text-lg font-bold text-white">{title}</h3>
      <div className="space-y-2 text-sm leading-6 text-white/78">{children}</div>
    </section>
  );
}

export default Card;

