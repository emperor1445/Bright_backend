// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

const app = express();

// Allowed origins: add more if you have preview domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://bright-project-main-wz5c.vercel.app",
  // you can add other Vercel preview domains if needed
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);
    // accept exact origins or any *.vercel.app preview domain:
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Simple health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.warn("⚠️  MONGO_URI not set — server will still start but DB will not connect.");
}

const mongoose = require("mongoose");
if (MONGO) {
  mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("✅ MongoDB connected");
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      // still start server so you can surface DB errors in logs if desired:
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (no DB)`));
    });
} else {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (no DB)`));
}
