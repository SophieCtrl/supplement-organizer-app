const express = require("express");
const router = express.Router();
const Supplement = require("../models/Supplement.model");
const auth = require("../middleware/auth");

// Add a new supplement (Admin or authenticated user access)
router.post("/add", auth, async (req, res) => {
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

// Get supplement by name (Public access)
router.get("/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const supplement = await Supplement.findOne({ name });
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
