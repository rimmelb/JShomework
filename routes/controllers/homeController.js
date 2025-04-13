// controllers/homeController.js

const Workout = require('../../models/workout');

// Eredeti index metódus (amely a sablon rendereléséhez szükséges adatokat adja át):
exports.index = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todaysWorkouts = await Workout.find({
      date: {
        $gte: start,
        $lt: end
      }
    });

    res.render('index', { todaysWorkouts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt az oldalak betöltésekor.");
  }
};

// Új API metódus JSON adatokkal:
exports.getTodaysWorkouts = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todaysWorkouts = await Workout.find({
      date: { $gte: start, $lt: end }
    });

    res.json({ todaysWorkouts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba történt" });
  }
};
