const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getSafeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };
};

const validateAuthInput = ({ username, email, password }, { requireUsername = false } = {}) => {
  const trimmedUsername = typeof username === "string" ? username.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (requireUsername && trimmedUsername.length < 2) {
    return { message: "Username must be at least 2 characters long" };
  }

  if (!emailRegex.test(normalizedEmail)) {
    return { message: "Please enter a valid email address" };
  }

  if (typeof password !== "string" || password.length < 6) {
    return { message: "Password must be at least 6 characters long" };
  }

  return {
    value: {
      username: trimmedUsername,
      email: normalizedEmail,
      password,
    },
  };
};

const register = async (req, res) => {
  const validation = validateAuthInput(req.body, { requireUsername: true });

  if (validation.message) {
    return res.status(400).json({ message: validation.message });
  }

  const { username, email, password } = validation.value;

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User registered successfully",
      user: getSafeUser(user),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const validation = validateAuthInput(req.body);

  if (validation.message) {
    return res.status(400).json({ message: validation.message });
  }

  const { email, password } = validation.value;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, getCookieOptions());

    res.json({
      message: "Login successful",
      user: getSafeUser(user),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", getCookieOptions());

  res.status(200).json({ message: "Logged out successfully" });
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Authenticated",
      user: getSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = { register, login, logout, me };
