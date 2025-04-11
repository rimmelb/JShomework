// models/goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  exercise: { type: String, required: true },
  exerciseType: { type: String, required: true },
  goal: { type: String, required: true }
});

module.exports = mongoose.model('Goal', goalSchema);