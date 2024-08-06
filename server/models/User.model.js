const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  nutritionalType: { type: String, required: true },
  illnesses: { type: [String], default: [] },
  symptoms: { type: [String], default: [] },
});

module.exports = mongoose.model("User", UserSchema);
