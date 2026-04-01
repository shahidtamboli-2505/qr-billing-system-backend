require("dotenv").config();
console.log("MONGO_URI LOADED:", process.env.MONGO_URI);
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const connectDB = require("./config/db");
const app = require("./app");

console.log("Starting backend...");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});