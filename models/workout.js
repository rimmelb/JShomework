// models/workout.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  exerciseType: { type: String, required: true },
  goal: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false},
});

const workoutSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  exercises: [exerciseSchema],
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Workout', workoutSchema);
