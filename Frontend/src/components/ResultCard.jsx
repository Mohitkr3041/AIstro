function ResultCard({ result, loading }) {
  if (loading) {
    return (
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.06] p-5 text-center text-teal-200">
        Reading your stars...
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.06] p-5 text-white">
      <h2 className="mb-3 text-lg font-bold">Astrology Data</h2>

      <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-white/72">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default ResultCard;
