import BirthForm from "../components/birth/BirthForm";

function BirthDetails() {
  return (
    <main className="aistro-shell">
      <div className="aistro-container grid min-h-screen items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
        <section>
          <p className="aistro-kicker">Birth Profile</p>
          <h1 className="aistro-title mt-5 max-w-xl text-5xl sm:text-6xl">
            Your chart needs the right foundation.
          </h1>
          <p className="aistro-muted mt-6 max-w-lg text-lg italic leading-8">
            These details shape the identity reading, past validation, future timeline, and remedies.
          </p>

          <div className="mt-9 grid gap-3">
            {[
              ["Date", "Positions the planets"],
              ["Time", "Improves chart precision"],
              ["Place", "Aligns the reading to location"],
            ].map(([label, value]) => (
              <div key={label} className="aistro-panel">
                <p className="aistro-kicker text-[10px]">{label}</p>
                <p className="mt-2 font-semibold text-[var(--parchment)]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl">
          <div className="aistro-card">
            <p className="aistro-kicker">Step 1</p>
            <h2 className="aistro-title mt-2 text-4xl">Enter Birth Details</h2>
            <p className="aistro-muted mt-3 text-base italic leading-7">
              Keep this accurate. Your generated reading depends on this input.
            </p>
            <div className="mt-7">
              <BirthForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default BirthDetails;
