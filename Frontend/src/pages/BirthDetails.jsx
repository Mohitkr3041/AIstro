import BirthForm from "../components/birth/BirthForm";

function BirthDetails() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Birth Details</h1>
        <p className="text-center text-gray-300 mb-6">
          Enter your birth information to generate your astrology report
        </p>

        <BirthForm />
      </div>
    </div>
  );
}

export default BirthDetails;
