import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <main className="aistro-shell">
      <header className="aistro-container flex items-center justify-between py-7">
        <div className="aistro-display text-xl text-[var(--gold-2)]">AIstro</div>
        <nav className="hidden gap-8 sm:flex">
          {["Chart", "Report", "Oracle"].map((item) => (
            <span key={item} className="aistro-kicker text-[10px] text-[var(--muted)]">
              {item}
            </span>
          ))}
        </nav>
        <button onClick={() => navigate("/auth")} className="aistro-button-secondary px-4 py-2">
          Enter
        </button>
      </header>

      <section className="aistro-container flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center pb-12 text-center">
        <div className="mb-10 grid h-28 w-28 place-items-center rounded-full border border-[rgba(212,175,55,0.36)] bg-[rgba(212,175,55,0.06)] shadow-[0_0_80px_rgba(212,175,55,0.16)]">
          <span className="aistro-display text-4xl text-[var(--gold-2)]">A</span>
        </div>
        <p className="aistro-kicker">Personal Vedic Astrology</p>
        <h1 className="aistro-title mt-6 max-w-5xl text-5xl sm:text-7xl lg:text-8xl">
          Decode Your Cosmic Blueprint
        </h1>
        <p className="aistro-muted mt-7 max-w-2xl text-lg italic leading-8 sm:text-xl">
          Begin with your birth profile, unlock a structured report, then ask the oracle focused questions about timing, patterns, and remedies.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate("/auth?mode=register")} className="aistro-button-primary">
            Cast My Chart
          </button>
          <button onClick={() => navigate("/auth")} className="aistro-button-secondary">
            I Have an Account
          </button>
        </div>

        <div className="mt-16 grid w-full gap-3 border-t border-[rgba(212,175,55,0.12)] pt-8 md:grid-cols-3">
          {[
            ["Birth Profile", "Capture the exact input your reading depends on."],
            ["Full Report", "Past validation, future prediction, life areas, and remedies."],
            ["Oracle Chat", "Ask follow-up questions with your report as context."],
          ].map(([title, body]) => (
            <article key={title} className="aistro-panel text-left">
              <h2 className="text-lg font-semibold text-[var(--gold-2)]">{title}</h2>
              <p className="aistro-muted mt-2 text-sm italic leading-6">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Landing;
