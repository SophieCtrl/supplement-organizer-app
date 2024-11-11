const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplementSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  contained_vitamins: [String],
  contained_minerals: [String],
  effect: { type: String, required: true },
  side_effects: { type: String },
  enhance_effect: [String],
  reduce_effect: [String],
  maximum_dosis: { type: String, required: true },
  dosis_per_kg: { type: String, required: true },
  is_vegan: { type: Boolean, required: true },
  is_vegetarian: { type: Boolean, required: true },
  goals: [String],
  symptoms: [String],
  brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Supplement = mongoose.model("Supplement", supplementSchema);
module.exports = Supplement;
