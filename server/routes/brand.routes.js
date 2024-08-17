const express = require("express");
const Brand = require("../models/Brand.model");

const router = express.Router();

// Get all brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single brand
router.get("/:id", getBrand, (req, res) => {
  res.json(res.brand);
});

// Create a brand
router.post("/", async (req, res) => {
  const brand = new Brand({
    name: req.body.name,
    description: req.body.description,
    // Add other properties here
  });

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a brand
router.patch("/:id", getBrand, async (req, res) => {
  if (req.body.name != null) {
    res.brand.name = req.body.name;
  }
  if (req.body.description != null) {
    res.brand.description = req.body.description;
  }
  // Update other properties here

  try {
    const updatedBrand = await res.brand.save();
    res.json(updatedBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a brand
router.delete("/:id", getBrand, async (req, res) => {
  try {
    await res.brand.remove();
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a single brand by ID
async function getBrand(req, res, next) {
  let brand;
  try {
    brand = await Brand.findById(req.params.id);
    if (brand == null) {
      return res.status(404).json({ message: "Brand not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.brand = brand;
  next();
}

module.exports = router;
