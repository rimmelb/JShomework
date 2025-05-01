// controllers/workoutController.js
const Workout = require('../../models/workout');
const Goal = require('../../models/goal');
const { EXERCISE_OPTIONS } = require('../helpers/constants');

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
  const data = { date: "", exercises: [{ exercise: "", exerciseType: "", goal: "" }] };
  res.render('new_workout', { data, errors: [], exerciseOptions: EXERCISE_OPTIONS });
}

/**
 * Új workout mentése.
 */
async function createWorkout(req, res, next) {

  try {
    // 1) Duplikátum-ellenőrzés
    const exists = await Workout.findOne({ date: req.body.date });
    if (exists) {
      return res.status(400).render('new_workout', {
        data: req.body,
        errors: [{ msg: 'Már rögzítettél edzést erre a napra.' }],
        exerciseOptions: EXERCISE_OPTIONS
      });
    }
  } catch (err) {
    return next(err);
  }
  try {
    const errors = require('express-validator').validationResult(req);
    if (req.body.action === 'refresh') {
      return res.render('new_workout', { data: req.body, errors: [], exerciseOptions: EXERCISE_OPTIONS });
    }
    if (!errors.isEmpty()) {
      return res.status(400).render('new_workout', { data: req.body, errors: errors.array(), exerciseOptions: EXERCISE_OPTIONS});
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

    
    for (let ex of newWorkout.exercises) {
      // Ha a goal mező nem üres
      if (ex.goal && ex.goal.trim() !== "") {
        const newGoal = new Goal({
          date: newWorkout.date,
          exercise: ex.exercise,
          exerciseType: ex.exerciseType,
          goal: ex.goal
        });
        await newGoal.save();
      }
    }

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
    res.render('edit_workout', { workout, errors: [], exerciseOptions: EXERCISE_OPTIONS });
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

    const origDateStr = workout.date.toISOString().split('T')[0];
    const newDate = req.body.date;
    // csak akkor ellenőrzünk, ha a dátum változott
    if (String(workout.date.toISOString().split('T')[0]) !== newDate) {
      const conflict = await Workout.findOne({
        date: newDate,
        _id: { $ne: workout._id }
      });
      if (conflict) {
        const updatedData = { ...workout.toObject(), ...req.body };
        return res.status(400).render('edit_workout', {
          workout: updatedData,
          errors: [{ msg: 'Már van edzés erre a napra.' }],
          exerciseOptions: EXERCISE_OPTIONS
        });
      }
    }
    if (req.body.action === 'refresh') {
      const updatedWorkout = { ...workout.toObject(), ...req.body };
      return res.render('edit_workout', { workout: updatedWorkout, errors: [], exerciseOptions: EXERCISE_OPTIONS });
    }
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      const updatedWorkout = { ...workout.toObject(), ...req.body };
      return res.status(400).render('edit_workout', { workout: updatedWorkout, errors: errors.array(), exerciseOptions: EXERCISE_OPTIONS });
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
    workout.completed = (req.body.completed === 'on' ? true : false);

    await workout.save();

    // 7) Régi célok teljes törlése az eredeti dátumra
    await Goal.deleteMany({ date: new Date(origDateStr) });

    // 8) Új célok beszúrása a frissített exercises tömbből
    for (const ex of workout.exercises) {
      if (ex.goal && ex.goal.trim() !== '') {
        await new Goal({
          date:         workout.date,
          exercise:     ex.exercise,
          exerciseType: ex.exerciseType,
          goal:         ex.goal
        }).save();
      }
    }

    if (workout.completed) {
      const Record = require('../../models/record');

      for (let ex of workout.exercises) {

        await Goal.deleteMany({
          date: workout.date,
          exercise: ex.exercise,
          exerciseType: ex.exerciseType
        });
    
        const newVal = parseFloat(ex.goal);
        if (isNaN(newVal)) continue;
    
        let record = await Record.findOne({
          exercise: ex.exercise,
          exerciseType: ex.exerciseType
        });
    
        if (!record) {
          record = new Record({
            date: workout.date,
            exercise: ex.exercise,
            exerciseType: ex.exerciseType,
            record: ex.goal 
          });
          await record.save();
        } else {
          let currentVal = parseFloat(record.record);
          if (newVal > currentVal) {
            record.date = workout.date;
            record.record = ex.goal;
            await record.save();
          }
        }
      }
    }

    res.redirect('/workouts');
  } catch (err) {
    next(err);
  }
}

/**
 * Workout és a hozzá kapcsolódó Goalok törlése.
 */
async function deleteWorkout(req, res, next) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).send('A workout nem található');
    }
    const exercises = workout.exercises.map(ex => ({
      exercise: ex.exercise,
      exerciseType: ex.exerciseType
    }));
    for (const ex of exercises) {
      await Goal.deleteMany({
        date: workout.date,
        exercise: ex.exercise,
        exerciseType: ex.exerciseType
      });
    }
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