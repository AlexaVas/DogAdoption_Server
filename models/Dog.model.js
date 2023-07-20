/** @format */

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dogSchema = new Schema({
  name: String,
  breed: String,
  age: String,
  shelter: { type: Schema.Types.ObjectId, ref: "Shelter" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  image: String,
  phone: Number,
});

module.exports = model("Dog", dogSchema);
