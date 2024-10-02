const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Register new user (Public)
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    height,
    weight,
    age,
    nutritionalType,
    goals,
    symptoms,
  } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: "Provide email, password, and username" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase, and one uppercase letter.",
    });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      username,
      email,
      password,
      height,
      weight,
      age,
      nutritionalType,
      goals,
      symptoms,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ authToken: token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Login user (Public)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password." });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json({ authToken: token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// GET /auth/verify - Verify JWT token
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
