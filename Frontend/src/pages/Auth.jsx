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

  const inputClass = "w-full rounded-lg border border-[#d8d1c3] bg-white px-4 py-3 text-[#1f2937] shadow-sm outline-none transition placeholder:text-[#8b8174] focus:border-[#2f8f83] focus:ring-4 focus:ring-[#2f8f83]/15";

  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#1f2937]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#1e2a44] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <img
            src={heroImage}
            alt="Astrology artwork"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e2a44] via-[#243b53]/92 to-[#2f8f83]/70" />

          <div className="relative">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              AIstro
            </div>
            <h1 className="mt-10 max-w-xl text-6xl font-black leading-[1.02]">
              Astrology that feels clear, personal, and useful.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/78">
              Start with birth details, validate the past, then unlock future timing and practical remedies.
            </p>
          </div>

          <div className="relative grid gap-3">
            {[
              ["01", "Save your chart input"],
              ["02", "Get a structured reading"],
              ["03", "Ask focused follow-up questions"],
            ].map(([step, label]) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f5b84b] font-black text-[#1e2a44]">
                  {step}
                </span>
                <p className="font-bold text-white">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-screen items-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex rounded-full bg-[#1e2a44] px-4 py-2 text-sm font-black text-white">
                AIstro
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight text-[#1e2a44]">
                Your personal astrology reading starts here.
              </h1>
            </div>

            <div className="rounded-lg border border-[#ded6c8] bg-white p-5 shadow-2xl shadow-[#1e2a44]/10 sm:p-6">
              <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-[#f2eadf] p-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`rounded-md px-4 py-2.5 text-sm font-black transition ${
                    isLogin ? "bg-[#1e2a44] text-white shadow" : "text-[#6b6258] hover:text-[#1e2a44]"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`rounded-md px-4 py-2.5 text-sm font-black transition ${
                    !isLogin ? "bg-[#1e2a44] text-white shadow" : "text-[#6b6258] hover:text-[#1e2a44]"
                  }`}
                >
                  Register
                </button>
              </div>

              <h2 className="text-3xl font-black text-[#1e2a44]">{isLogin ? "Welcome back" : "Create account"}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b6258]">
                {isLogin ? "Continue your saved astrology workspace." : "Create an account to save your reading and chat history."}
              </p>

              {status.message && (
                <div
                  className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "border-[#2f8f83]/25 bg-[#2f8f83]/10 text-[#1f6f66]"
                      : "border-[#e86f61]/30 bg-[#e86f61]/10 text-[#9f342b]"
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
                    className={inputClass}
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={inputClass}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={inputClass}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#e86f61] py-3 font-black text-white shadow-lg shadow-[#e86f61]/20 transition hover:bg-[#d85d50] disabled:opacity-70"
                >
                  {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6b6258]">
                {isLogin ? "New user?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="font-black text-[#2f8f83] hover:text-[#1f6f66]"
                  onClick={toggleMode}
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Auth;
