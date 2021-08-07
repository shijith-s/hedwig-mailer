const mongoose = require("mongoose");

const ScheduleSchema = mongoose.Schema({
  taskType: {
    type: String,
    enum: ["recurring", "scheduled"],
  },
  userID: {
    type: String,
    required: true,
  },
  mailID: {
    type: String,
    required: true,
  },
  cronExp: {
    type: String,
    required: true,
  },
  executeOn: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Schedules", ScheduleSchema);
