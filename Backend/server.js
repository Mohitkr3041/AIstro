require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db.js");

const dns = require("dns");
dns.setServers(["1.1.1.1"]);

connectDB();

const PORT = process.env.PORT || 5000;

console.log("Starting AIstro Backend... 🚀");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});