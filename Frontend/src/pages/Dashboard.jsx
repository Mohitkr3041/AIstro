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
        <p className="aistro-muted italic">Opening your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="aistro-shell">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 border-r border-[rgba(212,175,55,0.12)] bg-[rgba(4,2,10,0.86)] py-7 backdrop-blur-xl lg:flex lg:flex-col lg:items-center">
        <button onClick={() => navigate("/")} className="aistro-display mb-9 text-sm text-[var(--gold-2)]">
          AI
        </button>
        {[
          ["D", "/dashboard", true],
          ["R", "/report", false],
          ["C", "/chat", false],
          ["B", "/birth", false],
        ].map(([label, path, active]) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`mb-2 grid h-11 w-11 place-items-center rounded-[4px] border text-xs font-bold transition ${
              active
                ? "border-[rgba(212,175,55,0.48)] bg-[rgba(212,175,55,0.1)] text-[var(--gold-2)]"
                : "border-transparent text-[var(--muted)] hover:border-[rgba(212,175,55,0.22)] hover:text-[var(--gold-2)]"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={handleLogout} className="mb-2 grid h-11 w-11 place-items-center rounded-[4px] text-xs font-bold text-[#ffc1ba]">
          X
        </button>
      </aside>

      <main className="aistro-container py-6 lg:pl-24">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="aistro-kicker">Dashboard</p>
            <h1 className="aistro-title mt-2 text-4xl sm:text-5xl">
              Welcome, {birthData?.name || "seeker"}
            </h1>
            <p className="aistro-muted mt-2 italic">Your chart hub is ready.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate("/birth")} className="aistro-button-secondary px-4 py-2">
              Edit Birth
            </button>
            <button onClick={handleLogout} className="aistro-button border border-[rgba(192,57,43,0.34)] bg-[rgba(192,57,43,0.12)] px-4 py-2 text-[#ffc1ba]">
              Logout
            </button>
          </div>
        </header>

        {dashboardError && (
          <div className="mb-5 rounded-[4px] border border-[rgba(192,57,43,0.4)] bg-[rgba(192,57,43,0.12)] px-4 py-3 text-sm text-[#ffc1ba]">
            {dashboardError}
          </div>
        )}

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="aistro-card lg:col-span-2">
            <p className="aistro-kicker">Natal Input</p>
            <h2 className="aistro-title mt-3 text-4xl">Your saved birth profile</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Name", birthData?.name],
                ["Date", birthData?.dob],
                ["Time", birthData?.tob],
                ["Place", birthData?.place],
              ].map(([label, value]) => (
                <div key={label} className="aistro-panel">
                  <p className="aistro-kicker text-[10px]">{label}</p>
                  <p className="mt-2 break-words text-xl font-semibold text-[var(--parchment)]">{value || "-"}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="aistro-card">
            <p className="aistro-kicker">Next Step</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--gold-2)]">Generate the full reading</h2>
            <p className="aistro-muted mt-3 text-sm italic leading-6">
              Your report page handles the complete reading flow: identity, past, future, departments, and remedies.
            </p>
            <button onClick={() => navigate("/report")} className="aistro-button-primary mt-6 w-full">
              View Full Report
            </button>
          </article>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            ["Report", "Generate or refresh your structured astrology report.", "/report", "R"],
            ["Chat", "Ask follow-up questions based on your report and birth details.", "/chat", "C"],
            ["Birth", "Update chart input when your details need correction.", "/birth", "B"],
          ].map(([title, body, path, mark]) => (
            <button key={title} onClick={() => navigate(path)} className="aistro-card text-left transition hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-[4px] border border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.07)] text-lg font-bold text-[var(--gold-2)]">
                {mark}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-[var(--gold-2)]">{title}</h3>
              <p className="aistro-muted mt-2 text-sm italic leading-6">{body}</p>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
