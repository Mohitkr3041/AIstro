import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <main className="aistro-shell">
      <header className="aistro-container flex items-center justify-between py-5">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--ink)] text-sm font-black text-white">
            A
          </span>
          <span className="text-lg font-black tracking-[-0.04em]">AIstro</span>
        </button>

        <nav className="hidden items-center gap-7 text-sm font-bold text-slate-500 md:flex">
          <button onClick={() => navigate("/auth?mode=register")} className="transition hover:text-[var(--primary)]">Birth Profile</button>
          <button onClick={() => navigate("/report")} className="transition hover:text-[var(--primary)]">Report</button>
          <button onClick={() => navigate("/chat")} className="transition hover:text-[var(--primary)]">Chat</button>
        </nav>

        <button onClick={() => navigate("/auth")} className="aistro-button-secondary px-4 py-2">
          Sign in
        </button>
      </header>

      <section className="aistro-container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <div className="aistro-chip mb-6">Modern astrology workspace</div>
          <h1 className="aistro-title max-w-4xl text-5xl sm:text-7xl">
            Decode your chart with <span className="aistro-gradient-text">clear AI guidance.</span>
          </h1>
          <p className="aistro-muted mt-6 max-w-2xl text-lg leading-8">
            AIstro turns birth data into a structured reading, practical forecasts, remedies, and a focused chat companion.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate("/auth?mode=register")} className="aistro-button-primary">
              Start free reading
            </button>
            <button onClick={() => navigate("/auth")} className="aistro-button-secondary">
              Continue workspace
            </button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Birth details", "Capture the essentials once."],
              ["02", "Report", "Generate a readable chart story."],
              ["03", "Chat", "Ask follow-up questions anytime."],
            ].map(([step, title, body]) => (
              <article key={step} className="aistro-panel">
                <p className="text-xs font-black text-[var(--primary)]">{step}</p>
                <h2 className="mt-2 font-extrabold text-slate-950">{title}</h2>
                <p className="aistro-muted mt-1 text-sm leading-6">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-16 h-32 w-32 rounded-full bg-indigo-200/60 blur-3xl" />
          <div className="absolute -right-4 bottom-12 h-40 w-40 rounded-full bg-sky-200/70 blur-3xl" />
          <div className="aistro-card relative p-4 sm:p-5">
            <div className="rounded-[1.35rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">Today</p>
                  <h2 className="mt-2 text-2xl font-black">Cosmic dashboard</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 font-black">A</div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Chart clarity", "92%"],
                  ["Career signal", "Strong"],
                  ["Next window", "30 days"],
                  ["Saved chats", "12"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-xl font-black">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--primary)]">Forecast</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your next phase rewards focused decisions, cleaner routines, and direct conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Landing;
