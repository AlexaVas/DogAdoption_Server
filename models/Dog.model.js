/** @format */

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dogSchema = new Schema({
  name: String,
  breed: String,
  age: String,
  shelterName: String,
  shelter: { type: Schema.Types.ObjectId, ref: "Shelter" },
  user: [{ type: Schema.Types.ObjectId, ref: "User" }],
  description: String,
  image: Array,
  phone: String,
  location: String
});

module.exports = model("Dog", dogSchema);
