const mongoose = require("mongoose");
const mailSchema = require("./mails");

const registerSchema = mongoose.Schema({
  name: {
    type: String,
    min: 6,
    max: 255,
    required: true,
  },
  username: {
    type: String,
    min: 6,
    max: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  mails: {
    type: [mailSchema],
    unique: true,
  },
});

module.exports = mongoose.model("Registered-Users", registerSchema);
