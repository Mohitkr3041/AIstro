const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const astroRoutes = require("./routes/astro.route");
const authRoutes = require("./routes/auth.route");
const birthRoutes = require("./routes/birth.route");
const chatRoutes = require("./routes/chat.route");



const app = express();

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



app.use("/astro", astroRoutes);
app.use("/auth", authRoutes);
app.use("/birth", birthRoutes);
app.use("/chat", chatRoutes);

module.exports = app;
