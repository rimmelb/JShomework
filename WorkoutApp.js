// WorkoutApp.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Kapcsolódás az adatbázishoz – állítsd be a saját URI-dat!
mongoose.connect('mongodb://localhost:27017/js_homework')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// View engine beállítása
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// POST adatok feldolgozása és statikus fájlok kiszolgálása
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Router-ek betöltése
const goalsRouter = require('./routes/goals');
const recordsRouter = require('./routes/records');
const workoutsRouter = require('./routes/workouts');

app.use('/goals', goalsRouter);
app.use('/records', recordsRouter);
app.use('/workouts', workoutsRouter);

// Hibakezelő middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Valami hiba történt!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
