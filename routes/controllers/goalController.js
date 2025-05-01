// controllers/goalController.js
const Goal = require('../../models/goal');
const Workout = require('../../models/workout');
const { EXERCISE_TYPES, EXERCISE_OPTIONS } = require('../helpers/constants');

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
    if (req.body.action === 'refresh') {
      return res.render('new_goal', { data: req.body, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS });
    }
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('new_goal', { data: req.body, errors: errors.array()});
    }
    const newGoal = new Goal(req.body);
    await newGoal.save();
    const goalDate = new Date(newGoal.date);
    
    const workout = await Workout.findOne({
      date: {
        $gte: new Date(goalDate.getFullYear(), goalDate.getMonth(), goalDate.getDate()),
        $lt: new Date(goalDate.getFullYear(), goalDate.getMonth(), goalDate.getDate() + 1)
      }
    });

    if (workout) {
      workout.exercises.push({
        exercise: newGoal.exercise,
        exerciseType: newGoal.exerciseType,
        goal: newGoal.goal
      });
      await workout.save();
    }
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
    // Válassz ki típusokat a goal.exercise alapján.
    res.render('edit_goal', { goal, errors: [], EXERCISE_TYPES, EXERCISE_OPTIONS});
  } catch (err) {
    next(err);
  }
}

/**
 * Cél módosítása.
 */
async function updateGoal(req, res, next) {
  try {
    // 1) Lekérjük a korábbi célt
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).send('A cél nem található');

    // Eredeti értékek
    const origDate        = goal.date;
    const origExercise    = goal.exercise;
    const origExerciseType= goal.exerciseType;
    const origGoalValue   = goal.goal;

    // 2) Frissítjük a Goal dokumentumot
    goal.exercise     = req.body.exercise;
    goal.exerciseType = req.body.exerciseType;
    goal.date         = req.body.date;
    goal.goal         = req.body.goal;
    await goal.save();

    // 3) A hozzá tartozó Workout frissítése, ha létezik
    const workout = await Workout.findOne({
      date: {
        $gte: new Date(origDate.setHours(0,0,0,0)),
        $lt:  new Date(origDate.setHours(24,0,0,0))
      }
    });

    if (workout) {
      let changed = false;
      workout.exercises = workout.exercises.map(ex => {
        if (
          ex.exercise      === origExercise &&
          ex.exerciseType  === origExerciseType &&
          ex.goal          === origGoalValue
        ) {
          ex.exercise     = req.body.exercise;
          ex.exerciseType = req.body.exerciseType;
          ex.goal         = req.body.goal;
          changed = true;
        }
        return ex;
      });
      if (changed) await workout.save();
    }

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
    // 1) Lekérjük a törlendő célt
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).send('A cél nem található');

    const { date, exercise, exerciseType, goal: goalValue } = goal.toObject();

    // 2) Töröljük a Goal dokumentumot
    await goal.remove();

    // 3) A hozzá tartozó Workout esetén kiszűrjük a megfelelő elemet
    const workout = await Workout.findOne({
      date: {
        $gte: new Date(date.setHours(0,0,0,0)),
        $lt:  new Date(date.setHours(24,0,0,0))
      }
    });

    if (workout) {
      const filtered = workout.exercises.filter(ex =>
        !(
          ex.exercise     === exercise &&
          ex.exerciseType === exerciseType &&
          ex.goal         === goalValue
        )
      );
      if (filtered.length !== workout.exercises.length) {
        workout.exercises = filtered;
        await workout.save();
      }
    }

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