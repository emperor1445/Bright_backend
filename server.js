const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// ✅ Connect to MongoDB Atlas (no deprecated options)
mongoose.connect(
  "mongodb+srv://davidemperor1445:prospermongodb@cluster0.igwin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  console.log("✅ MongoDB connected");

  const PORT = 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.error("❌ MongoDB connection error:", err));
