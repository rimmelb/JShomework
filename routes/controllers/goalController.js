// controllers/goalController.js
const Goal = require('../models/goal');
const { EXERCISE_TYPES, EXERCISE_OPTIONS } = require('../helpers/constants');
const { findAndRender, updateAndRedirect } = require('../helpers/crud');

/**
 * Listázza a célokat.
 */
async function listGoals(req, res, next) {
  try {
    const goals = await Goal.find({});
    res.render('goals', { goals });
  } catch (err) {
    next(err);
  }
}

/**
 * Új cél űrlap megjelenítése.
 */
function newGoalForm(req, res) {
  res.render('new_goal', { data: {}, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
}

/**
 * Új cél mentése.
 */
async function createGoal(req, res, next) {
  try {
    // "refresh" esetén csak újrarendereljük az űrlapot
    if (req.body.action === 'refresh') {
      return res.render('new_goal', { data: req.body, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('new_goal', { data: req.body, errors: errors.array(), EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.redirect('/goals');
  } catch (err) {
    next(err);
  }
}

/**
 * Szerkesztő űrlap megjelenítése egy adott célhoz.
 */
async function editGoalForm(req, res, next) {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).send('A cél nem található');
    res.render('edit_goal', { goal, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
  } catch (err) {
    next(err);
  }
}

/**
 * Cél módosítása.
 */
async function updateGoal(req, res, next) {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).send('A cél nem található');
    if (req.body.action === 'refresh') {
      // Újrarendereljük a szerkesztő oldalt a frissített adatokkal.
      return res.render('edit_goal', { goal: { ...goal.toObject(), ...req.body }, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('edit_goal', { goal: { ...goal.toObject(), ...req.body }, errors: errors.array(), EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    Object.assign(goal, req.body);
    await goal.save();
    res.redirect('/goals');
  } catch (err) {
    next(err);
  }
}

/**
 * Cél törlése.
 */
async function deleteGoal(req, res, next) {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.redirect('/goals');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listGoals,
  newGoalForm,
  createGoal,
  editGoalForm,
  updateGoal,
  deleteGoal,
};