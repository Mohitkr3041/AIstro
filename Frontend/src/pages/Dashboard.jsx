import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import { logoutUser } from "../services/auth.service";

function Dashboard({ setIsAuthenticated = () => {} }) {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [loadingBirth, setLoadingBirth] = useState(true);

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
      <div className="aistro-shell grid min-h-screen place-items-center">
        <p className="aistro-muted">Opening your dashboard...</p>
      </div>
    );
  }

  const navItems = [
    ["Dashboard", "/dashboard", true],
    ["Report", "/report", false],
    ["Chat", "/chat", false],
    ["Birth", "/birth", false],
  ];

  return (
    <div className="aistro-shell">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-24 border-r border-slate-200/80 bg-white/75 py-6 backdrop-blur-xl lg:flex lg:flex-col lg:items-center">
        <button onClick={() => navigate("/")} className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          A
        </button>
        {navItems.map(([label, path, active]) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            title={label}
            className={`mb-2 grid h-12 w-12 place-items-center rounded-2xl border text-xs font-black transition ${
              active
                ? "border-indigo-100 bg-indigo-50 text-[var(--primary)]"
                : "border-transparent text-slate-400 hover:bg-white hover:text-slate-900"
            }`}
          >
            {label.slice(0, 1)}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={handleLogout} className="grid h-12 w-12 place-items-center rounded-2xl text-xs font-black text-red-500 hover:bg-red-50">
          X
        </button>
      </aside>

      <main className="aistro-container py-6 lg:pl-28">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="aistro-chip mb-3">Dashboard</div>
            <h1 className="aistro-title text-4xl sm:text-5xl">
              Welcome back, {birthData?.name || "seeker"}
            </h1>
            <p className="aistro-muted mt-2">Your astrology workspace is organized into clear, focused pages.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate("/report")} className="aistro-button-primary px-4 py-2.5">
              Generate report
            </button>
            <button onClick={handleLogout} className="aistro-button-secondary px-4 py-2.5 text-red-600">
              Logout
            </button>
          </div>
        </header>

        {dashboardError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {dashboardError}
          </div>
        )}

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="aistro-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="aistro-kicker">Birth profile</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">Saved chart input</h2>
              </div>
              <button onClick={() => navigate("/birth")} className="aistro-button-secondary px-4 py-2.5">
                Edit input
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Name", birthData?.name],
                ["Date", birthData?.dob],
                ["Time", birthData?.tob],
                ["Place", birthData?.place],
              ].map(([label, value]) => (
                <div key={label} className="aistro-panel">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                  <p className="mt-2 break-words text-xl font-black text-slate-950">{value || "-"}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="aistro-card bg-slate-950 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-200">Recommended</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Complete your full reading</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The report page now owns generation and presentation, keeping dashboard clean and scannable.
            </p>
            <div className="mt-6 grid gap-3">
              {["Identity", "Past validation", "Future timeline", "Remedies"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold">
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/report")} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-indigo-50">
              Open report page
            </button>
          </article>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            ["Report", "Generate or refresh your full astrology report.", "/report", "from-indigo-500 to-violet-500"],
            ["Chat", "Ask contextual follow-up questions.", "/chat", "from-sky-500 to-cyan-500"],
            ["Birth", "Update birth details and regenerate later.", "/birth", "from-amber-500 to-orange-500"],
          ].map(([title, body, path, gradient]) => (
            <button key={title} onClick={() => navigate(path)} className="aistro-card text-left transition hover:-translate-y-1 hover:shadow-2xl">
              <span className={`mb-5 block h-2 w-16 rounded-full bg-gradient-to-r ${gradient}`} />
              <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">{title}</h3>
              <p className="aistro-muted mt-2 text-sm leading-6">{body}</p>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
