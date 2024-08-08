const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  supplements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplement" }],
});

module.exports = mongoose.model("Goal", GoalSchema);
