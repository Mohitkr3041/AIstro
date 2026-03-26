import BirthForm from "../components/BirthForm";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4">
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white text-center">
        
        <h1 className="text-3xl font-bold mb-2">🔮 AIstro</h1>
        <p className="text-gray-300 mb-6">AI Powered Astrology</p>

        <BirthForm />

      </div>
    </div>
  );
}

export default Home;