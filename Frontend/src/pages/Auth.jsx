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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });

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

      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

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
      <div className="aistro-container grid min-h-screen items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
        <section className="hidden lg:block">
          <div className="max-w-2xl">
            <div className="mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-[rgba(212,175,55,0.36)] bg-[rgba(212,175,55,0.06)] shadow-[0_0_70px_rgba(212,175,55,0.12)]">
              <div className="aistro-display text-4xl text-[var(--gold-2)]">A</div>
            </div>
            <p className="aistro-kicker">AIstro Oracle</p>
            <h1 className="aistro-title mt-5 text-6xl">
              Astrology with ritual, clarity, and timing.
            </h1>
            <p className="aistro-muted mt-6 max-w-xl text-xl italic leading-8">
              Save your birth details, receive a structured chart reading, then ask focused follow-up questions from the same cosmic workspace.
            </p>

            <div className="mt-10 grid gap-3">
              {[
                ["01", "Birth profile", "Set the foundation for your chart."],
                ["02", "Personal report", "Past patterns, future timing, remedies."],
                ["03", "Oracle chat", "Ask about the reading with context saved."],
              ].map(([step, title, body]) => (
                <div key={step} className="aistro-panel flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[4px] bg-[rgba(155,89,182,0.28)] text-sm font-bold text-[var(--gold-2)]">
                    {step}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--parchment)]">{title}</p>
                    <p className="aistro-muted text-sm italic">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-7 lg:hidden">
            <p className="aistro-kicker">AIstro</p>
            <h1 className="aistro-title mt-3 text-4xl">Your chart starts here.</h1>
          </div>

          <div className="aistro-card">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-[rgba(212,175,55,0.34)] bg-[rgba(212,175,55,0.07)] text-2xl text-[var(--gold-2)]">
                A
              </div>
              <h2 className="aistro-title text-3xl">{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p className="aistro-muted mt-2 italic">
                {isLogin ? "The stars kept your workspace warm." : "Create your account and cast your birth profile."}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-[4px] border border-[rgba(154,100,21,0.18)] bg-[rgba(255,248,232,0.74)] p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`rounded-[3px] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition ${
                  isLogin ? "bg-[rgba(155,89,182,0.42)] text-[var(--gold-2)]" : "text-[var(--muted)] hover:text-[var(--gold-2)]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`rounded-[3px] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition ${
                  !isLogin ? "bg-[rgba(155,89,182,0.42)] text-[var(--gold-2)]" : "text-[var(--muted)] hover:text-[var(--gold-2)]"
                }`}
              >
                Register
              </button>
            </div>

            {status.message && (
              <div
                className={`mb-5 rounded-[4px] border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-[rgba(35,118,74,0.28)] bg-[rgba(35,118,74,0.08)] text-[#1f6b44]"
                    : "border-[rgba(180,59,47,0.32)] bg-[rgba(180,59,47,0.08)] text-[#8f2f26]"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    className="aistro-input"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full birth name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className="aistro-input"
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="aistro-input"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="aistro-input"
              />

              {!isLogin && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="aistro-input"
                    />
                    <input
                      type="time"
                      name="tob"
                      value={formData.tob}
                      onChange={handleChange}
                      className="aistro-input"
                    />
                  </div>
                  <input
                    type="text"
                    name="place"
                    placeholder="Birth city"
                    value={formData.place}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    className="aistro-input"
                  />
                </>
              )}

              <button type="submit" disabled={loading} className="aistro-button-primary w-full">
                {loading ? "Please Wait" : isLogin ? "Enter Sanctum" : "Create Account & Cast Chart"}
              </button>
            </form>

            <p className="aistro-muted mt-6 text-center text-sm italic">
              {isLogin ? "New user?" : "Already have an account?"}{" "}
              <button type="button" className="font-bold text-[var(--amethyst-2)] hover:text-[var(--gold-2)]" onClick={toggleMode}>
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Auth;
