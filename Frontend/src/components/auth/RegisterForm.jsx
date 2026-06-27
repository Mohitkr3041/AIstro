import { useState } from "react";
import { registerUser } from "../../services/auth.service";

function RegisterForm({ switchToLogin }) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(formData);
      alert(res.data.message);

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      switchToLogin();
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-2">🔮 AIstro</h1>
      <p className="text-center text-gray-300 mb-6">Create your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:scale-105 transition"
        >
          Register
        </button>
      </form>

      <p className="text-center text-gray-300 mt-6">
        Already have an account?{" "}
        <span
          className="text-indigo-400 cursor-pointer hover:underline"
          onClick={switchToLogin}
        >
          Login
        </span>
      </p>
    </>
  );
}

export default RegisterForm;