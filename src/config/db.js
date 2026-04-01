const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.trim() === "") {
      throw new Error(
        "MONGO_URI is not set. Ensure .env is loaded and MONGO_URI is defined."
      );
    }

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoUri.replace(/^"|"$/g, ""), {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("⚠️  Check: 1) Atlas IP Whitelist  2) Network connection  3) MONGO_URI in .env");
    process.exit(1);
  }
};

module.exports = connectDB;