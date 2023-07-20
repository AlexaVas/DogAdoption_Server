/** @format */

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const shelterSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, unique: true, required: true },
  description: String,
  dogs: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
});

module.exports = model("Shelter", shelterSchema);
