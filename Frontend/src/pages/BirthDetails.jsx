import BirthForm from "../components/birth/BirthForm";
import heroImage from "../assets/hero.png";

function BirthDetails() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071014] px-3 py-5 text-white sm:px-4 sm:py-8">
      <img
        src={heroImage}
        alt="Abstract astrology artwork"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#071014] via-[#071014]/90 to-[#16251f]/75" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-5xl items-center gap-6 sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Birth profile</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Set the foundation for your reading.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Accurate birth details help AIstro generate a more useful report and more relevant chat guidance.
          </p>
        </section>

        <section className="rounded-lg border border-white/12 bg-black/35 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
          <h2 className="text-2xl font-bold">Birth Details</h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your birth information to generate your astrology report.
          </p>
          <div className="mt-6">
            <BirthForm />
          </div>
        </section>
      </div>
    </main>
  );
}

export default BirthDetails;
