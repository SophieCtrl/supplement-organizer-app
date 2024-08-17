const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  brand: { type: String, required: true },
  form: {
    type: String,
    required: true,
    enum: ["pills", "capsules", "powder", "drops"],
  },
  size: { type: String, required: true, default: "180 pills" },
  dosage_mg: { type: Number, required: true },
  additional_ingrediens: [String],
  vegan: { type: Boolean, required: true },
  parent_supplement: {
    type: Schema.Types.ObjectId,
    ref: "Supplement",
    required: true,
  },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
