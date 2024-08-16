const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { addUserSupplement } = require("../controllers/userController");
const mongoose = require("mongoose");

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

// Get user profile (Authenticated)
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("personal_supplements.supplement");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to retrieve user");
  }
});

// Update user profile (Authenticated)
router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { height, weight, age, nutritionalType, goals, symptoms } = req.body;
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
        height,
        weight,
        age,
        nutritionalType,
        goals: Array.isArray(goals) ? goals : goals.split(", "),
        symptoms: Array.isArray(symptoms) ? symptoms : symptoms.split(", "),
      },
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error updating profile");
  }
});

// Route to add a supplement to a user's list
router.post("/supplements", async (req, res) => {
  const { userId, supplementId, dosage, frequency, time } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(supplementId)
  ) {
    return res.status(400).json({ message: "Invalid userId or supplementId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new supplement entry with a unique ObjectId
    const newSupplement = {
      supplement: supplementId,
      dosage: dosage,
      frequency: frequency,
      time: time,
      _id: new mongoose.Types.ObjectId(), // Generate a unique ObjectId for the supplement entry
    };

    // Add the supplementId to the user's personal_supplements array
    user.personal_supplements.push(newSupplement);
    await user.save();

    res.status(200).json({ message: "Supplement added successfully" });
  } catch (error) {
    console.error("Server Error:", error.stack); // Log the error stack trace
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to update supplement details for a user
router.put("/supplements/:supplementId", isAuthenticated, async (req, res) => {
  try {
    const { supplementId } = req.params;
    const { dosage, frequency, time } = req.body;

    const user = await User.findById(req.user.id);
    console.log("User's supplements:", user.personal_supplements);
    console.log("Supplement ID to update:", supplementId);

    const supplement = user.personal_supplements.find(
      (supp) => supp._id.toString() === supplementId
    );

    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found." });
    }

    supplement.dosage = dosage;
    supplement.frequency = frequency;
    supplement.time = time;
    await user.save();
    res.status(200).json({ message: "Supplement updated successfully." });
  } catch (error) {
    console.error("Failed to update supplement:", error);
    res.status(500).json({ message: "Failed to update supplement." });
  }
});

module.exports = router;
