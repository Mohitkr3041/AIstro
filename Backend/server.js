require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db.js");

const dns = require("dns")
dns.setServers(["1.1.1.1"])

connectDB();

const PORT = 5000;

console.log("Starting AIstro Backend... 🚀");

app.use(cors({
  origin: "https://a-istro.vercel.app",
  credentials: true
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});