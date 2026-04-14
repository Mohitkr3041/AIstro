const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const astroRoutes = require("./routes/astro.route");
const authRoutes = require("./routes/auth.route");
const birthRoutes = require("./routes/birth.route");
const chatRoutes = require("./routes/chat.route");
const createRateLimiter = require("./middleware/rateLimit.middleware");



const app = express();
const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 8,
  message: "Too many AI requests. Please wait a minute and try again.",
});

app.set("trust proxy", 1);

app.use(cookieParser());

const allowedOrigins = (process.env.CLIENT_ORIGIN || "https://a-istro.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));


app.get("/", (req, res) => {
    res.send("AIstro Backend Running 🚀");
});



app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.use("/astro", aiRateLimiter, astroRoutes);
app.use("/auth", authRoutes);
app.use("/birth", birthRoutes);
app.use("/chat", chatRoutes);

module.exports = app;
