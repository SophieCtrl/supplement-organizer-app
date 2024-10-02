const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const mongoose = require("mongoose");

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
      _id: new mongoose.Types.ObjectId(),
    };

    // Add the supplementId to the user's personal_supplements array
    user.personal_supplements.push(newSupplement);
    await user.save();

    res.status(200).json({ message: "Supplement added successfully" });
  } catch (error) {
    console.error("Server Error:", error.stack);
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

// Route to delete a supplement from a user's list
router.delete(
  "/supplements/:supplementId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { supplementId } = req.params;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const supplementIndex = user.personal_supplements.findIndex(
        (supp) => supp._id.toString() === supplementId
      );

      if (supplementIndex === -1) {
        return res.status(404).json({ message: "Supplement not found" });
      }

      user.personal_supplements.splice(supplementIndex, 1);
      await user.save();

      res.status(200).json({ message: "Supplement deleted successfully" });
    } catch (error) {
      console.error("Failed to delete supplement:", error);
      res.status(500).json({ message: "Failed to delete supplement" });
    }
  }
);

module.exports = router;
