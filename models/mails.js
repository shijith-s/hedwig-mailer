const mongoose = require("mongoose");

const mailSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 255,
  },
  subject: {
    type: String,
    required: true,
    max: 1024,
  },
  recipients: {
    type: Array,
    required: true,
  },
  body: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  schedule: {
    type: String,
    // required: true,
  },
  scheduleType: {
    type: String,
  },
});

module.exports = mailSchema;
