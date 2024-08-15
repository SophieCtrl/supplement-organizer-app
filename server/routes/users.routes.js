const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { addUserSupplement } = require("../controllers/userController");

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

// Get user supplements (Authenticated)
router.get("/api/users/supplements", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "personal_supplements"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user.personal_supplements);
  } catch (error) {
    console.error("Error fetching supplements:", error);
    res.status(500).json({ message: "Failed to fetch supplements." });
  }
});

// Update user profile (Authenticated)
router.put("/profile", async (req, res) => {
  try {
    let { goals, symptoms, ...otherData } = req.body;

    // Validate and sanitize goals and symptoms
    if (typeof goals === "string")
      goals = goals.split(",").map((goal) => goal.trim());
    if (typeof symptoms === "string")
      symptoms = symptoms.split(",").map((symptom) => symptom.trim());

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { goals, symptoms, ...otherData },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in /profile:", error.message);
    res.status(500).json({ error: "Profile update failed. Please try again." });
  }
});

// Route to add a supplement to a user's list
router.post("/supplements", isAuthenticated, addUserSupplement);

// Route to update supplement details for a user
router.put("/supplements/:supplementId", async (req, res) => {
  try {
    const { supplementId } = req.params;
    const { dosage, frequency, time } = req.body;

    const user = await User.findById(req.user._id);
    const supplement = user.personal_supplements.find(
      (supp) => supp.id.toString() === supplementId
    );

    if (supplement) {
      supplement.dosage = dosage;
      supplement.frequency = frequency;
      supplement.time = time;
      await user.save();
      res.status(200).json({ message: "Supplement updated successfully." });
    } else {
      res.status(404).json({ message: "Supplement not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update supplement." });
  }
});

module.exports = router;
