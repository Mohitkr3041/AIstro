import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import { loginUser, registerUser } from "../services/auth.service";
import heroImage from "../assets/hero.png";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Auth({ setIsAuthenticated = () => {} }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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

    if (!isLogin && username.length < 2) {
      return "Username must be at least 2 characters long.";
    }

    if (!emailRegex.test(email)) {
      return "Enter a valid email address.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

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

      const res = isLogin
        ? await loginUser({
            email: formData.email.trim(),
            password: formData.password,
          })
        : await registerUser({
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
          });

      if (!isLogin) {
        setIsLogin(true);
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        setStatus({
          type: "success",
          message: res.data.message || "Account created. You can log in now.",
        });
        return;
      }

      setIsAuthenticated(true);

      const birthRes = await getBirthDetails();

      if (birthRes.data.data) {
        navigate("/dashboard");
      } else {
        navigate("/birth");
      }
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
    <main className="relative min-h-screen overflow-hidden bg-[#071014] px-3 py-5 text-white sm:px-4 sm:py-8">
      <img
        src={heroImage}
        alt="Abstract astrology artwork"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#071014] via-[#071014]/90 to-[#241126]/80" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-6xl items-center gap-6 sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <section className="max-w-2xl pt-4 sm:pt-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">AI powered astrology</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">Meet your chart with more clarity.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
            Save your birth details, generate a personal report, and keep a conversation that remembers what you asked before.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Birth details"],
              ["02", "Personal report"],
              ["03", "Saved chat"],
            ].map(([step, label]) => (
              <div key={step} className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                <p className="text-xs font-semibold text-teal-200">{step}</p>
                <p className="mt-1 text-sm text-white/75">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/12 bg-black/35 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
          <div className="mb-6 flex rounded-lg border border-white/10 bg-white/[0.06] p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-md px-3 py-2 text-sm sm:px-4 font-semibold transition ${isLogin ? "bg-teal-300 text-black" : "text-white/65 hover:text-white"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-md px-3 py-2 text-sm sm:px-4 font-semibold transition ${!isLogin ? "bg-teal-300 text-black" : "text-white/65 hover:text-white"}`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-2 text-sm text-white/60">
            {isLogin ? "Continue your saved reading." : "Start with a secure account."}
          </p>

          {status.message && (
            <div
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                  : "border-red-300/40 bg-red-500/10 text-red-100"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full rounded-lg border border-white/15 bg-white/10 p-3 placeholder-white/40 outline-none transition focus:border-teal-300"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-lg border border-white/15 bg-white/10 p-3 placeholder-white/40 outline-none transition focus:border-teal-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full rounded-lg border border-white/15 bg-white/10 p-3 placeholder-white/40 outline-none transition focus:border-teal-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-300 py-3 font-semibold text-black transition hover:bg-teal-200 disabled:opacity-70"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            {isLogin ? "New user?" : "Already have an account?"} {" "}
            <button
              type="button"
              className="font-semibold text-teal-200 hover:text-teal-100"
              onClick={toggleMode}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Auth;

