import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBirthDetails, saveBirthDetails } from "../services/birth.service";
import { loginUser, registerUser } from "../services/auth.service";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Auth({ setIsAuthenticated = () => {} }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    dob: "",
    tob: "",
    place: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus({ type: "", message: "" });
  };

  const validateForm = () => {
    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!isLogin && username.length < 2) return "Username must be at least 2 characters long.";
    if (!emailRegex.test(email)) return "Enter a valid email address.";
    if (formData.password.length < 6) return "Password must be at least 6 characters long.";
    if (!isLogin && formData.name.trim().length < 2) return "Enter your full name.";
    if (!isLogin && !formData.dob) return "Choose your date of birth.";
    if (!isLogin && new Date(formData.dob) > new Date()) return "Date of birth cannot be in the future.";
    if (!isLogin && !formData.tob) return "Choose your time of birth.";
    if (!isLogin && formData.place.trim().length < 2) return "Enter your place of birth.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      if (isLogin) {
        await loginUser({ email: formData.email.trim(), password: formData.password });
        setIsAuthenticated(true);
        const birthRes = await getBirthDetails();
        navigate(birthRes.data.data ? "/dashboard" : "/birth");
        return;
      }

      await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      await loginUser({ email: formData.email.trim(), password: formData.password });
      await saveBirthDetails({
        name: formData.name.trim(),
        dob: formData.dob,
        tob: formData.tob,
        place: formData.place.trim(),
      });

      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setStatus({ type: "", message: "" });
  };

  return (
    <main className="aistro-shell">
      <div className="aistro-container grid min-h-screen items-center gap-10 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <button onClick={() => navigate("/")} className="mb-14 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--ink)] text-sm font-black text-white">A</span>
            <span className="text-xl font-black tracking-[-0.04em]">AIstro</span>
          </button>

          <div className="aistro-chip mb-6">{isLogin ? "Welcome back" : "New workspace"}</div>
          <h1 className="aistro-title max-w-2xl text-6xl">
            {isLogin ? "Continue your astrology workspace." : "Create your chart profile in one flow."}
          </h1>
          <p className="aistro-muted mt-6 max-w-xl text-lg leading-8">
            {isLogin
              ? "Your saved report, birth details, and chat history stay connected."
              : "Registration includes birth details so users land directly on the dashboard."}
          </p>

          <div className="mt-10 grid max-w-xl gap-3">
            {[
              ["Account", "Secure cookie-based authentication"],
              ["Birth data", "Name, date, time, and place captured on signup"],
              ["Workspace", "Dashboard, report, and chat split into dedicated pages"],
            ].map(([title, body]) => (
              <div key={title} className="aistro-panel flex items-center gap-4">
                <span className="modern-orb grid h-11 w-11 shrink-0 place-items-center text-sm font-black text-[var(--primary)]">
                  {title.slice(0, 1)}
                </span>
                <div>
                  <p className="font-extrabold text-slate-950">{title}</p>
                  <p className="aistro-muted text-sm">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <div className="mb-7 lg:hidden">
            <button onClick={() => navigate("/")} className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--ink)] text-sm font-black text-white">A</span>
              <span className="text-lg font-black">AIstro</span>
            </button>
            <h1 className="aistro-title text-4xl">{isLogin ? "Welcome back." : "Create your chart."}</h1>
          </div>

          <div className="aistro-card">
            <div className="mb-6">
              <p className="aistro-kicker">{isLogin ? "Sign in" : "Register"}</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
                {isLogin ? "Access your workspace" : "Account and birth profile"}
              </h2>
              <p className="aistro-muted mt-2 text-sm">
                {isLogin ? "Continue where you left off." : "Birth input is saved immediately after registration."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                  isLogin ? "bg-white text-[var(--primary)] shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                  !isLogin ? "bg-white text-[var(--primary)] shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Register
              </button>
            </div>

            {status.message && (
              <div
                className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} autoComplete="username" className="aistro-input" />
                  <input type="text" name="name" placeholder="Full birth name" value={formData.name} onChange={handleChange} autoComplete="name" className="aistro-input" />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} autoComplete="email" className="aistro-input" />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} autoComplete={isLogin ? "current-password" : "new-password"} className="aistro-input" />
              </div>

              {!isLogin && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="aistro-input" />
                    <input type="time" name="tob" value={formData.tob} onChange={handleChange} className="aistro-input" />
                  </div>
                  <input type="text" name="place" placeholder="Birth city" value={formData.place} onChange={handleChange} autoComplete="address-level2" className="aistro-input" />
                </>
              )}

              <button type="submit" disabled={loading} className="aistro-button-primary w-full">
                {loading ? "Please wait" : isLogin ? "Open dashboard" : "Create account and save birth data"}
              </button>
            </form>

            <p className="aistro-muted mt-6 text-center text-sm">
              {isLogin ? "New user?" : "Already have an account?"}{" "}
              <button type="button" className="font-extrabold text-[var(--primary)]" onClick={toggleMode}>
                {isLogin ? "Create account" : "Login"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Auth;
