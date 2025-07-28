const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const router = express.Router();
const SECRET = "supersecret";

// ✅ Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email }, SECRET, { expiresIn: "1h" });
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ✅ Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;




// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../model/User");

// const router = express.Router();

// const SECRET = "supersecret";

// // ✅ Register route
// router.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if email exists
//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email already registered" });

//     // Hash password
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Create user
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     // Generate token
//     const token = jwt.sign({ id: newUser._id, email }, SECRET, { expiresIn: "1h" });

//     res.status(201).json({ message: "User registered", token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Login route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isValid = bcrypt.compareSync(password, user.password);
//     if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, email }, SECRET, { expiresIn: "1h" });

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;



