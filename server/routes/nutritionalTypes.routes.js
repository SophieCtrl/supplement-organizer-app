const express = require("express");
const router = express.Router();
const NutritionalType = require("../models/NutritionalType.model");

// Get all nutritional types (Public access)
router.get("/", async (req, res) => {
  try {
    const nutritionalTypes = await NutritionalType.find().populate(
      "supplements"
    );
    res.json(nutritionalTypes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get a nutritional type by ID (Public access)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const nutritionalType = await NutritionalType.findById(id).populate(
      "supplements"
    );
    if (!nutritionalType) {
      return res.status(404).json({ message: "Nutritional Type not found" });
    }
    res.json(nutritionalType);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
