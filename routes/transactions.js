const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const transactions = require("../data/transactions");

const SECRET = "supersecret"; // same secret as in auth

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
}

// Add transaction
router.post("/", verifyToken, (req, res) => {
  const { type, amount, category, description } = req.body;
  const newTransaction = {
    id: Date.now(),
    userId: req.userId,
    type,
    amount,
    category,
    description,
    date: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  res.status(201).json({ message: "Transaction added", transaction: newTransaction });
});

// Get all transactions for logged-in user
router.get("/", verifyToken, (req, res) => {
  const userTransactions = transactions.filter((t) => t.userId === req.userId);
  res.json(userTransactions);
});

module.exports = router;
