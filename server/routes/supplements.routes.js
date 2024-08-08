const express = require("express");
const router = express.Router();
const Supplement = require("../models/Supplement.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Add a new supplement (Admin or authenticated user access)
router.post("/add", isAuthenticated, async (req, res) => {
  const { name, recommendedDosage, timing, interactions } = req.body;

  try {
    let supplement = new Supplement({
      name,
      recommendedDosage,
      timing,
      interactions,
    });
    await supplement.save();
    res.status(201).json(supplement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get all supplements (Public access)
router.get("/", async (req, res) => {
  try {
    const supplements = await Supplement.find();
    res.json(supplements);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get supplement by ID (Public access)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const supplement = await Supplement.findById(id);
    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.json(supplement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
