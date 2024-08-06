const mongoose = require("mongoose");

const SupplementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  recommendedDosage: { type: String, required: true },
  timing: { type: String, required: true },
  interactions: { type: [String] },
});

module.exports = mongoose.model("Supplement", SupplementSchema);
