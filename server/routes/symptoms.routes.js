const express = require("express");
const router = express.Router();
const Symptom = require("../models/Symptom.model");

// Get all symptoms (Public access)
router.get("/", async (req, res) => {
  try {
    const symptoms = await Symptom.find().populate("supplements", "name");
    res.json(symptoms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get a symptom by ID (Public access)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const symptom = await Symptom.findById(id).populate("supplements", "name");
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res.json(symptom);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
