const express = require("express");
const router = express.Router();
const Supplement = require("../models/Supplement.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Brand = require("../models/Brand.model");

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
// Filtered Supplements Route
router.get("/", async (req, res) => {
  try {
    const { symptoms, goals, nutritional_types } = req.query;

    const filter = {};
    if (symptoms)
      filter.symptoms = {
        $in: symptoms.split(",").map((symptom) => symptom.trim()),
      };
    if (goals)
      filter.goals = { $in: goals.split(",").map((goal) => goal.trim()) };
    if (nutritional_types)
      filter.nutritional_types = {
        $in: nutritional_types.split(",").map((nt) => nt.trim()),
      };

    const supplements = await Supplement.find(filter).populate(
      "contained_vitamins contained_minerals enhance_effect reduce_effect"
    );

    res.json(supplements);
  } catch (error) {
    console.error("Error in GET /:", error.message);
    res
      .status(500)
      .json({ error: "Failed to retrieve supplements. Please try again." });
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

// Get all filter options (Public access)
router.get("/filters", async (req, res) => {
  try {
    const symptoms = await Symptom.find().lean();
    const goals = await Goal.find().lean();
    const nutritionalTypes = await NutritionalType.find().lean();

    res.json({ symptoms, goals, nutritionalTypes });
  } catch (error) {
    console.error("Error in /filters:", error.message);
    res
      .status(500)
      .json({ error: "Failed to retrieve filters. Please try again." });
  }
});

// Get all brands for a specific supplement
router.get("/:supplementId/brands", async (req, res) => {
  try {
    const brands = await Brand.find({
      parent_supplement: req.params.supplementId,
    });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a brand
router.post("/:supplementId/brands", async (req, res) => {
  const brand = new Brand({
    brand: req.body.name,
    form: req.body.form,
    size: req.body.size,
    dosage_mg: req.body.dosage_mg,
    additional_ingrediens: req.body.additional_ingrediens,
    vegan: req.body.vegan,
    parent_supplement: req.params.supplementId,
  });

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
