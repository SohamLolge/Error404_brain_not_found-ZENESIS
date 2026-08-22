const dns = require("dns");
const mongoose = require("mongoose");

// Use Google's DNS for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;