const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware"); // Importing middleware

const saltRounds = 10;

// POST /auth/signup - Creates a new user
router.post("/signup", (req, res) => {
  const { email, password, username } = req.body;

  // Basic validations
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

  // Check if user already exists
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Hash password and create new user
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      return User.create({ email, password: hashedPassword, username });
    })
    .then((createdUser) => {
      const { email, username, _id } = createdUser;
      const user = { email, username, _id };
      res.status(201).json({ user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// POST /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password." });
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ message: "User not found." });
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, username } = foundUser;
        const payload = { _id, email, username };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// GET /auth/verify - Verify JWT token
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
