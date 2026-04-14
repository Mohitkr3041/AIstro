import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import { generateAstroReport } from "../services/astro.service";
import { logoutUser } from "../services/auth.service";
import Report from "../components/astro/Report";
import ChatBox from "../components/chat/ChatBox";
import heroImage from "../assets/hero.png";

function Dashboard({ setIsAuthenticated = () => {} }) {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingBirth, setLoadingBirth] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  const generateReportData = async () => {
    try {
      setLoadingReport(true);
      setReportError("");
      setNotice("");
      const res = await generateAstroReport();
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
      <div className="min-h-screen bg-[#071014] px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-40 animate-pulse rounded-lg bg-white/10" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-lg bg-white/10" />
            <div className="h-28 animate-pulse rounded-lg bg-white/10" />
            <div className="h-28 animate-pulse rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071014] text-white">
      <div className="relative overflow-hidden border-b border-white/10">
        <img
          src={heroImage}
          alt="Abstract astrology artwork"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071014] via-[#071014]/85 to-[#1e1022]/70" />
        <div className="relative mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Personal astrology workspace</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">AIstro Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/72">
                Explore your birth details, read your report, and keep a running conversation with Astro AI.
              </p>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <button
                onClick={() => navigate("/birth")}
                className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Edit Birth Details
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              ["Profile", birthData?.name || "Saved"],
              ["Report", report ? "Ready" : loadingReport ? "Generating" : "Pending"],
              ["Chat", "History enabled"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-8 px-3 py-6 sm:px-4 sm:py-8">
        {dashboardError && (
          <div className="rounded-lg border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {dashboardError}
          </div>
        )}

        {notice && !reportError && (
          <div className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </div>
        )}

        {birthData && (
          <section className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Birth Details</p>
                <h2 className="mt-1 text-2xl font-bold">Your saved chart input</h2>
              </div>
              <button
                onClick={generateReportData}
                disabled={loadingReport}
                className="w-full rounded-lg bg-teal-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-teal-200 disabled:opacity-60 sm:w-auto"
              >
                {loadingReport ? "Generating..." : "Refresh Report"}
              </button>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Name", birthData.name],
                ["Date", birthData.dob],
                ["Time", birthData.tob],
                ["Place", birthData.place],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/20 px-3 py-3">
                  <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
                  <p className="mt-1 font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {loadingReport ? (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="h-56 animate-pulse rounded-lg bg-white/10" />
            <div className="h-56 animate-pulse rounded-lg bg-white/10" />
          </section>
        ) : reportError ? (
          <section className="rounded-lg border border-red-300/30 bg-red-500/10 p-6 text-center">
            <p className="mb-4 text-red-100">{reportError}</p>
            <button
              onClick={generateReportData}
              className="rounded-lg bg-teal-300 px-5 py-3 font-semibold text-black transition hover:bg-teal-200"
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

