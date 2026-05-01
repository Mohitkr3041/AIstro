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
      setNotice(
        res.data.cached
          ? "Loaded your saved astrology report."
          : "Generated a fresh astrology report."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to generate report";

      setReportError(errorMessage);
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
      <div className="min-h-screen bg-[#f6f1e8] px-4 py-8 text-[#1f2937]">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-40 animate-pulse rounded-lg bg-[#1e2a44]/10" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-lg bg-[#2f8f83]/10" />
            <div className="h-28 animate-pulse rounded-lg bg-[#f5b84b]/20" />
            <div className="h-28 animate-pulse rounded-lg bg-[#e86f61]/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-[#1f2937]">
      <header className="sticky top-0 z-20 border-b border-[#ded6c8] bg-[#f6f1e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1e2a44] font-black text-white">
              A
            </div>
            <div>
              <p className="text-sm font-black text-[#1e2a44]">AIstro</p>
              <p className="text-xs font-bold text-[#7b7166]">Personal astrology workspace</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/birth")}
              className="rounded-lg border border-[#d8d1c3] bg-white px-4 py-2 text-sm font-black text-[#1e2a44] shadow-sm transition hover:border-[#2f8f83] hover:text-[#2f8f83]"
            >
              Edit Birth Details
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-[#e86f61]/25 bg-[#e86f61]/10 px-4 py-2 text-sm font-black text-[#9f342b] transition hover:bg-[#e86f61]/15"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:py-8">
        <section className="overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-2xl shadow-[#1e2a44]/10">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-5 sm:p-7 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#2f8f83]">Your reading hub</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-[#1e2a44] sm:text-5xl">
                Decode the past, understand the present, and plan the future.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#6b6258]">
                Your dashboard keeps the structured astrology reading first, with chat as a focused companion.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => generateReportData(true)}
                  disabled={loadingReport}
                  className="rounded-lg bg-[#e86f61] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#e86f61]/20 transition hover:bg-[#d85d50] disabled:opacity-60"
                >
                  {loadingReport ? "Generating..." : "Generate Fresh Reading"}
                </button>
                <button
                  onClick={() => navigate("/birth")}
                  className="rounded-lg border border-[#d8d1c3] bg-[#fbf8f2] px-5 py-3 text-sm font-black text-[#1e2a44] transition hover:border-[#2f8f83] hover:text-[#2f8f83]"
                >
                  Update Chart Input
                </button>
              </div>
            </div>

            <div className="bg-[#1e2a44] p-5 text-white sm:p-7 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f5b84b]">Chart input</p>
              <div className="mt-5 grid gap-3">
                {[
                  ["Name", birthData?.name],
                  ["Date", birthData?.dob],
                  ["Time", birthData?.tob],
                  ["Place", birthData?.place],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/12 bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-white/45">{label}</p>
                    <p className="mt-1 font-black text-white">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {dashboardError && (
          <div className="rounded-lg border border-[#e86f61]/30 bg-[#e86f61]/10 px-4 py-3 text-sm text-[#9f342b]">
            {dashboardError}
          </div>
        )}

        {notice && !reportError && (
          <div className="rounded-lg border border-[#2f8f83]/25 bg-[#2f8f83]/10 px-4 py-3 text-sm font-bold text-[#1f6f66]">
            {notice}
          </div>
        )}

        {loadingReport ? (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-lg bg-[#1e2a44]/10" />
            <div className="h-56 animate-pulse rounded-lg bg-[#f5b84b]/20" />
          </section>
        ) : reportError ? (
          <section className="rounded-lg border border-[#e86f61]/30 bg-white p-6 text-center shadow-xl shadow-[#1e2a44]/10">
            <p className="mb-4 text-[#9f342b]">{reportError}</p>
            <button
              onClick={generateReportData}
              className="rounded-lg bg-[#e86f61] px-5 py-3 font-black text-white transition hover:bg-[#d85d50]"
            >
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
