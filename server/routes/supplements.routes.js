const express = require("express");
const router = express.Router();
const Supplement = require("../models/Supplement.model");
const Symptom = require("../models/Symptom.model");
const Goal = require("../models/Goal.model");
const NutritionalType = require("../models/NutritionalType.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Add a new supplement (Authenticated user access)
router.post("/", isAuthenticated, async (req, res) => {
  const {
    name,
    type,
    description,
    contained_vitamins,
    contained_minerals,
    effect,
    side_effects,
    enhance_effect,
    reduce_effect,
    maximum_dosis,
    dosis_per_kg,
    nutritional_type,
    goals,
    symptoms,
  } = req.body;

  try {
    let supplement = new Supplement({
      name,
      type,
      description,
      contained_vitamins,
      contained_minerals,
      effect,
      side_effects,
      enhance_effect,
      reduce_effect,
      maximum_dosis,
      dosis_per_kg,
      nutritional_type,
      goals,
      symptoms,
    });
    await supplement.save();
    await Symptom.updateMany(
      { _id: { $in: symptoms } },
      { $addToSet: { supplements: supplement._id } }
    );

    await Goal.updateMany(
      { _id: { $in: goals } },
      { $addToSet: { supplements: supplement._id } }
    );

    await NutritionalType.updateMany(
      { _id: { $in: nutritional_type } },
      { $addToSet: { supplements: supplement._id } }
    );
    res.status(201).json(supplement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get all supplements (Public access)
router.get("/", async (req, res) => {
  try {
    const supplements = await Supplement.find()
      .populate("nutritional_type")
      .populate("symptoms")
      .populate("goals");
    res.json(supplements);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get a supplement by ID (Public access)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const supplement = await Supplement.findById(id)
      .populate("nutritional_type")
      .populate("symptoms")
      .populate("goals");
    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.json(supplement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Update a supplement (Authenticated user access)
router.put("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    description,
    contained_vitamins,
    contained_minerals,
    effect,
    side_effects,
    enhance_effect,
    reduce_effect,
    maximum_dosis,
    dosis_per_kg,
    nutritional_type,
    goals,
    symptoms,
  } = req.body;

  try {
    const supplement = await Supplement.findByIdAndUpdate(
      id,
      {
        name,
        type,
        description,
        contained_vitamins,
        contained_minerals,
        effect,
        side_effects,
        enhance_effect,
        reduce_effect,
        maximum_dosis,
        dosis_per_kg,
        nutritional_type,
        goals,
        symptoms,
      },
      { new: true }
    );

    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.json(supplement);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Delete a supplement (Authenticated user access)
router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const supplement = await Supplement.findByIdAndDelete(id);
    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }
    res.json({ message: "Supplement deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
