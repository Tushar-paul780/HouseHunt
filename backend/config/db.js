const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern Mongoose doesn't need these options but they are harmless
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

    // Handle connection events after initial connect
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting reconnect…");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("♻️  MongoDB reconnected");
    });
  } catch (error) {
    console.error("❌  MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
