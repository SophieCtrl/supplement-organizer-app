const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  nutritionalType: { type: String, required: true },
  goals: { type: [String], default: [] },
  symptoms: { type: [String], default: [] },
  personal_supplements: [
    {
      supplement: { type: Schema.Types.ObjectId, ref: "Supplement" },
      dosage: { type: Number },
      frequency: { type: String },
      time: { type: String },
      _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
