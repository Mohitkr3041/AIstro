function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="mt-6 text-center text-indigo-300">
        🔮 Reading your stars...
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-6 p-5 bg-white/10 backdrop-blur-lg rounded-xl text-white">
      <h2 className="text-lg font-bold mb-3">✨ Astrology Data</h2>

      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default ResultCard;