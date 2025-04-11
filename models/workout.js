// models/workout.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  exercise: { type: String, required: true },
  exerciseType: { type: String, required: true },
  goal: { type: String, required: true }  // Itt célként használjuk, de lehet "description" is
});

const workoutSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  exercises: [exerciseSchema]
});

module.exports = mongoose.model('Workout', workoutSchema);
