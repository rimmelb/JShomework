// models/record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  exercise: { type: String, required: true },
  exerciseType: { type: String, required: true },
  record: { type: String, required: true }
});

module.exports = mongoose.model('Record', recordSchema);
