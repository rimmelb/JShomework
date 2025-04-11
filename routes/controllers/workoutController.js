// controllers/workoutController.js
const Workout = require('../models/workout');
const { EXERCISE_TYPES, EXERCISE_OPTIONS } = require('../helpers/constants');

/**
 * Edzések listázása.
 */
async function listWorkouts(req, res, next) {
  try {
    const workouts = await Workout.find({});
    res.render('workouts', { workouts });
  } catch (err) {
    next(err);
  }
}

/**
 * Új workout űrlap megjelenítése.
 */
function newWorkoutForm(req, res) {
  // Ha nincs adat, inicializálunk egy üres exercise csoportot
  const data = { date: "", exercises: [{ exercise: "", exerciseType: "", goal: "" }] };
  res.render('new_workout', { data, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
}

/**
 * Új workout mentése.
 */
async function createWorkout(req, res, next) {
  try {
    const errors = require('express-validator').validationResult(req);
    if (req.body.action === 'refresh') {
      return res.render('new_workout', { data: req.body, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    if (!errors.isEmpty()) {
      return res.status(400).render('new_workout', { data: req.body, errors: errors.array(), EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    let exercises = [];
    if (Array.isArray(req.body.exercise)) {
      for (let i = 0; i < req.body.exercise.length; i++) {
        exercises.push({
          exercise: req.body.exercise[i],
          exerciseType: req.body.exerciseType[i],
          goal: req.body.goal[i]
        });
      }
    } else {
      exercises.push({
        exercise: req.body.exercise,
        exerciseType: req.body.exerciseType,
        goal: req.body.goal
      });
    }
    const newWorkout = new Workout({
      date: req.body.date,
      exercises
    });
    await newWorkout.save();
    res.redirect('/workouts');
  } catch (err) {
    next(err);
  }
}

/**
 * Workout szerkesztő űrlap megjelenítése.
 */
async function editWorkoutForm(req, res, next) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send('A workout nem található');
    res.render('edit_workout', { workout, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
  } catch (err) {
    next(err);
  }
}

/**
 * Workout módosítása.
 */
async function updateWorkout(req, res, next) {
  try {
    let workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).send('A workout nem található');
    if (req.body.action === 'refresh') {
      const updatedWorkout = { ...workout.toObject(), ...req.body };
      return res.render('edit_workout', { workout: updatedWorkout, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      const updatedWorkout = { ...workout.toObject(), ...req.body };
      return res.status(400).render('edit_workout', { workout: updatedWorkout, errors: errors.array(), EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    let exercises = [];
    if (Array.isArray(req.body.exercise)) {
      for (let i = 0; i < req.body.exercise.length; i++) {
        exercises.push({
          exercise: req.body.exercise[i],
          exerciseType: req.body.exerciseType[i],
          goal: req.body.goal[i]
        });
      }
    } else {
      exercises.push({
        exercise: req.body.exercise,
        exerciseType: req.body.exerciseType,
        goal: req.body.goal
      });
    }
    workout.date = req.body.date;
    workout.exercises = exercises;
    await workout.save();
    res.redirect('/workouts');
  } catch (err) {
    next(err);
  }
}

/**
 * Workout törlése.
 */
async function deleteWorkout(req, res, next) {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect('/workouts');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listWorkouts,
  newWorkoutForm,
  createWorkout,
  editWorkoutForm,
  updateWorkout,
  deleteWorkout,
};