import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBirthDetails } from "../services/birth.service";
import { loginUser, registerUser } from "../services/auth.service";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-2">AIstro</h1>
        <p className="text-center text-gray-300 mb-6">
          {isLogin ? "Welcome back" : "Create your account"}
        </p>

        {status.message && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                : "border-red-300/40 bg-red-500/10 text-red-100"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          {isLogin ? "New user?" : "Already have an account?"} {" "}
          <button
            type="button"
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={toggleMode}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
