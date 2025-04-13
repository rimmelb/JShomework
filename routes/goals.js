const express = require('express');
const router = express.Router();
const { goalValidators } = require('./helpers/validators');
const goalController = require('./controllers/goalController');

router.get('/', goalController.listGoals);

router.get('/new', goalController.newGoalForm);

router.post('/', goalValidators, goalController.createGoal);

router.get('/:id/edit', goalController.editGoalForm);

router.post('/:id/edit', goalValidators, goalController.updateGoal);

router.post('/:id/delete', goalController.deleteGoal);

module.exports = router;
