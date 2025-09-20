const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  name: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  pets: [PetSchema],
});

module.exports = mongoose.model("User", UserSchema);
