// controllers/homeController.js

const Workout = require('../../models/workout');

// Eredeti index metódus (amely a sablon rendereléséhez szükséges adatokat adja át):
// Példa a homeController.index metódus kiegészítésére:
exports.index = async (req, res) => {
  try {
    const today = new Date();
    
    // Mai nap lekérdezése
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todaysWorkouts = await Workout.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    });
    
    // Aktuális hónap határainak meghatározása
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    // Csak a teljesített (completed: true) edzések számának lekérdezése
    const monthly_completed_Workouts = await Workout.find({
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
      completed: true
    });

    const monthly_notcompleted_Workouts = await Workout.find({
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
      completed: false
    });
    
    let totalWorkouts = monthly_completed_Workouts.length + monthly_notcompleted_Workouts.length;
    const trainingsDone = totalWorkouts > 0 ? Math.round((monthly_completed_Workouts.length/totalWorkouts) * 100) : 0;
    
    // A célkitűzéseket úgy számoljuk, hogy a teljesített edzésekben hány olyan gyakorlat szerepel,
    // amelynek kitöltött, nem üres célja van.
    let goals_already_Achieved = 0;
    let goals_not_Achieved = 0;

    monthly_completed_Workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.goal && ex.goal.trim() !== "") {
          goals_already_Achieved++;
        }
      });
    });

    monthly_notcompleted_Workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        if (ex.goal && ex.goal.trim() !== "") {
          goals_not_Achieved++;
        }
      });
    });

    let totalGoals = goals_already_Achieved + goals_not_Achieved;
    let goalsAchieved = totalGoals > 0 ? Math.round((goals_already_Achieved / totalGoals) * 100) : 0;
    
    res.render('index', { 
      todaysWorkouts, 
      trainingsDone, 
      goalsAchieved 
    });

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
