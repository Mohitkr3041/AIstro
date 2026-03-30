const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const astroRoutes = require("./routes/astro.route");
const authRoutes = require("./routes/auth.route");
const birthRoutes = require("./routes/birth.route");
const chatRoutes = require("./routes/chat.route");



const app = express();

app.use(cookieParser());




app.use(cors({
  origin: "https://a-istro.vercel.app",
  credentials: true
}));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("AIstro Backend Running 🚀");
});

app.use("/astro", astroRoutes);
app.use("/auth", authRoutes);
app.use("/birth", birthRoutes);
app.use("/chat", chatRoutes);

module.exports = app;