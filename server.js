require("dotenv").config();

const invoiceRoutes = require("./routes/invoiceRoutes");
const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/", invoiceRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Expense Copilot Backend is running 🚀"
  });
});

// Start server only after MongoDB connects
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();