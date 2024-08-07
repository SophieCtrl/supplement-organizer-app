const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Register new user
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    height,
    weight,
    age,
    nutritionalType,
    illnesses,
    symptoms,
  } = req.body;

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
      illnesses,
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

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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

// Get user profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to retrieve user");
  }
});

module.exports = router;
