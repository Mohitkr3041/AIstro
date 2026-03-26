import { useState } from "react";
import { loginUser } from "../../services/auth.service";
import { getBirthDetails } from "../../services/birth.service";
import { useNavigate } from "react-router-dom";

function LoginForm({ setIsAuthenticated, switchToRegister }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login data:", formData);

    try {
      const res = await loginUser(formData);
      alert(res.data.message);

      setIsAuthenticated(true);

      const birthRes = await getBirthDetails();

      if (birthRes.data.data) {
        navigate("/dashboard");
      } else {
        navigate("/birth");
      }
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">🔮 AIstro</h1>
      <p className="text-center text-gray-300 mb-6">Welcome back</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          autoComplete="current-password"
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-300 mt-6">
        New user?{" "}
        <span
          className="text-indigo-400 cursor-pointer hover:underline"
          onClick={switchToRegister}
        >
          Register
        </span>
      </p>
    </>
  );
}

export default LoginForm;