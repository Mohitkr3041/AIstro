import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateAstroReport } from "../services/astro.service";
import Report from "../components/astro/Report";

function ReportPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [notice, setNotice] = useState("");
  const [reportError, setReportError] = useState("");
  const [loadingReport, setLoadingReport] = useState(true);

  const generateReportData = async (forceRefresh = false) => {
    try {
      setLoadingReport(true);
      setReportError("");
      setNotice("");
      const res = await generateAstroReport({ forceRefresh });
      setReport(res.data.data);
      setNotice(res.data.cached ? "Loaded your saved astrology report." : "Generated a fresh astrology report.");
    } catch (error) {
      setReportError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to generate report"
      );
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    generateReportData();
  }, []);

  return (
    <main className="aistro-shell">
      <div className="aistro-container space-y-6 py-6 sm:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button onClick={() => navigate("/dashboard")} className="aistro-button-secondary mb-4 px-4 py-2">
              Back to Dashboard
            </button>
            <p className="aistro-kicker">Full Report</p>
            <h1 className="aistro-title mt-2 text-4xl sm:text-5xl">Cosmic Blueprint</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => generateReportData(true)} disabled={loadingReport} className="aistro-button-primary">
              {loadingReport ? "Generating" : "Generate Fresh"}
            </button>
            <button onClick={() => navigate("/chat")} className="aistro-button-secondary">
              Ask Oracle
            </button>
          </div>
        </header>

        {notice && !reportError && (
          <div className="rounded-[4px] border border-[rgba(35,118,74,0.28)] bg-[rgba(35,118,74,0.08)] px-4 py-3 text-sm font-bold text-[#1f6b44]">
            {notice}
          </div>
        )}

        {loadingReport ? (
          <section className="aistro-card grid min-h-[22rem] place-items-center">
            <p className="aistro-muted italic">Reading the chart...</p>
          </section>
        ) : reportError ? (
          <section className="aistro-card text-center">
            <p className="mb-4 text-[#8f2f26]">{reportError}</p>
            <button onClick={() => generateReportData()} className="aistro-button-primary">
              Try Again
            </button>
          </section>
        ) : (
          <Report report={report} />
        )}
      </div>
    </main>
  );
}

export default ReportPage;
