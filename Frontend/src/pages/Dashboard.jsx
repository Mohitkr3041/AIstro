import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import { generateAstroReport } from "../services/astro.service";
import { logoutUser } from "../services/auth.service";
import Report from "../components/astro/Report";
import ChatBox from "../components/chat/ChatBox";

function Dashboard({ setIsAuthenticated = () => {} }) {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingBirth, setLoadingBirth] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

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
    const fetchBirthDetails = async () => {
      try {
        const res = await getBirthDetails();
        const data = res.data.data;

        if (!data) {
          navigate("/birth");
          return;
        }

        setBirthData(data);
        generateReportData();
      } catch (error) {
        setDashboardError(error.response?.data?.message || "Failed to fetch birth details.");
      } finally {
        setLoadingBirth(false);
      }
    };

    fetchBirthDetails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      navigate("/", { replace: true });
    } catch (error) {
      setDashboardError(error.response?.data?.message || error.message || "Logout failed.");
    }
  };

  if (loadingBirth) {
    return (
      <div className="aistro-shell px-4 py-8">
        <div className="aistro-container space-y-4">
          <div className="h-48 animate-pulse rounded-[6px] border border-[rgba(212,175,55,0.16)] bg-white/5" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-[6px] bg-[rgba(155,89,182,0.12)]" />
            <div className="h-28 animate-pulse rounded-[6px] bg-[rgba(212,175,55,0.12)]" />
            <div className="h-28 animate-pulse rounded-[6px] bg-[rgba(39,174,96,0.1)]" />
          </div>
        </div>
      </div>
    );
  }

  const summary = report?.chart_summary || {};

  return (
    <div className="aistro-shell">
      <header className="sticky top-0 z-30 border-b border-[rgba(212,175,55,0.14)] bg-[rgba(4,2,10,0.82)] backdrop-blur-xl">
        <div className="aistro-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[4px] border border-[rgba(212,175,55,0.34)] bg-[rgba(212,175,55,0.06)] aistro-display text-[var(--gold-2)]">
              A
            </div>
            <div>
              <p className="aistro-kicker">AIstro</p>
              <p className="aistro-muted text-sm italic">Personal astrology workspace</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate("/birth")} className="aistro-button-secondary px-4 py-2">
              Edit Birth
            </button>
            <button
              onClick={handleLogout}
              className="aistro-button border border-[rgba(192,57,43,0.34)] bg-[rgba(192,57,43,0.12)] px-4 py-2 text-[#ffc1ba]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="aistro-container space-y-6 py-6 sm:py-8">
        <section className="aistro-card">
          <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div>
              <p className="aistro-kicker">Your Reading Hub</p>
              <h1 className="aistro-title mt-4 max-w-3xl text-5xl sm:text-6xl">
                Decode the past, read the present, plan the future.
              </h1>
              <p className="aistro-muted mt-5 max-w-2xl text-lg italic leading-8">
                Your structured reading comes first, with chat as a focused companion for timing, remedies, career, and relationship questions.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => generateReportData(true)} disabled={loadingReport} className="aistro-button-primary">
                  {loadingReport ? "Generating" : "Generate Fresh Reading"}
                </button>
                <button onClick={() => navigate("/birth")} className="aistro-button-secondary">
                  Update Chart Input
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Name", birthData?.name],
                ["Date", birthData?.dob],
                ["Time", birthData?.tob],
                ["Place", birthData?.place],
                ["Sun", summary.sun_sign],
                ["Moon", summary.moon_sign],
              ].map(([label, value]) => (
                <div key={label} className="aistro-panel">
                  <p className="aistro-kicker text-[10px]">{label}</p>
                  <p className="mt-2 break-words text-lg font-semibold text-[var(--parchment)]">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {dashboardError && (
          <div className="rounded-[4px] border border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.12)] px-4 py-3 text-sm text-[#ffc1ba]">
            {dashboardError}
          </div>
        )}

        {notice && !reportError && (
          <div className="rounded-[4px] border border-[rgba(39,174,96,0.35)] bg-[rgba(39,174,96,0.1)] px-4 py-3 text-sm font-bold text-[#b9f6cb]">
            {notice}
          </div>
        )}

        {loadingReport ? (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-[6px] border border-[rgba(212,175,55,0.16)] bg-white/5" />
            <div className="h-56 animate-pulse rounded-[6px] border border-[rgba(212,175,55,0.16)] bg-white/5" />
          </section>
        ) : reportError ? (
          <section className="aistro-card text-center">
            <p className="mb-4 text-[#ffc1ba]">{reportError}</p>
            <button onClick={() => generateReportData()} className="aistro-button-primary">
              Try Again
            </button>
          </section>
        ) : (
          <Report report={report} />
        )}

        <ChatBox birthData={birthData} />
      </main>
    </div>
  );
}

export default Dashboard;
