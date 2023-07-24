/** @format */

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const shelterSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic for phone number
        // Check if the phone number is 10 digits long
        return String(value).length > 8;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: { type: String, unique: true, required: true },
  description: String,
  dogs: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
});

module.exports = model("Shelter", shelterSchema);
