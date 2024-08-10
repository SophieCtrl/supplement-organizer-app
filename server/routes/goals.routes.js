const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal.model");

// Get all goals (Public access)
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().populate("supplements");
    res.json(goals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get a goal by ID (Public access)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findById(id).populate("supplements");
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json(goal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
