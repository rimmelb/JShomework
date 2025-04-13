const express = require('express');
const router = express.Router();
const { workoutValidators } = require('./helpers/validators');
const workoutController = require('./controllers/workoutController');

router.get('/', workoutController.listWorkouts);

router.get('/new', workoutController.newWorkoutForm);

router.post('/', workoutValidators, workoutController.createWorkout);

router.get('/:id/edit', workoutController.editWorkoutForm);

router.post('/:id/edit', workoutValidators, workoutController.updateWorkout);

router.post('/:id/delete', workoutController.deleteWorkout);

module.exports = router;
