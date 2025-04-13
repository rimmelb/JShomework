// routes/home.js
const express = require('express');
const router = express.Router();
const homeController = require('./controllers/homeController');

router.get('/', homeController.index);
router.get('/api/todays-workouts', homeController.getTodaysWorkouts);

module.exports = router;
