const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: false,
  },
  readingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("envData", DataSchema);
