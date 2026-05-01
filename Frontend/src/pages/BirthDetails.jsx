import BirthForm from "../components/birth/BirthForm";
import heroImage from "../assets/hero.png";

function BirthDetails() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#1e2a44] p-6 text-white sm:p-10">
          <img
            src={heroImage}
            alt="Astrology artwork"
            className="absolute inset-0 h-full w-full object-cover opacity-18"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e2a44] via-[#243b53]/90 to-[#2f8f83]/75" />

          <div className="relative flex min-h-[42vh] flex-col justify-between lg:min-h-full">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f5b84b]">Birth profile</p>
              <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Your chart needs the right foundation.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                These details help AIstro shape a more personal identity reading, past validation, future timeline, and remedies.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {[
                ["Date", "Positions the planets"],
                ["Time", "Improves chart precision"],
                ["Place", "Aligns the reading to location"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">{label}</p>
                  <p className="mt-1 font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-2xl">
            <div className="rounded-lg border border-[#ded6c8] bg-white p-5 shadow-2xl shadow-[#1e2a44]/10 sm:p-7">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2f8f83]">Step 1</p>
              <h2 className="mt-2 text-3xl font-black text-[#1e2a44]">Enter birth details</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b6258]">
                Keep this accurate. Your generated reading depends on this input.
              </p>
              <div className="mt-6">
                <BirthForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default BirthDetails;
