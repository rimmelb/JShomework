const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS nézetmotor beállítása
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Adatok (memóriabeli tárolás)
let workouts = [
  {
    id: 1,
    date: '2025-03-17',
    exercises: [
      { exercise: 'Running', exerciseType: 'Distance', goal: '5 km' }
    ]
  },
  {
    id: 2,
    date: '2025-03-16',
    exercises: [
      { exercise: 'Weightlifting', exerciseType: 'Bench Press', goal: '60 kg' },
      { exercise: 'Weightlifting', exerciseType: 'Squat', goal: '80 kg' }
    ]
  }
];

let goals = [
  { id: 1, date: '2024-02-17', exercise: 'Weightlifting', exerciseType: 'Squat', goal: '80 kg' },
  { id: 2, date: '2023-02-18', exercise: 'Weightlifting', exerciseType: 'Shoulder Press', goal: '45 kg' },
  { id: 3, date: '2025-01-13', exercise: 'Swimming', exerciseType: 'Backstroke', goal: '5 km' },
  { id: 4, date: '2022-03-04', exercise: 'Cycling', exerciseType: 'Distance', goal: '150 km' }
];

let records = [
  { id: 1, date: '2025-03-17', exercise: 'Running', exerciseType: 'Distance', record: '5 km' },
  { id: 2, date: '2025-03-16', exercise: 'Weightlifting', exerciseType: 'Bench Press', record: '60 kg' }
];

/* ======== ALAPOLDAL ======== */
app.get('/', (req, res) => {
  res.render('index');
});

/* ======== EDZÉSEK (WORKOUTS) ======== */
// Edzések listázása
app.get('/workouts', (req, res) => {
  res.render('workouts', { workouts });
});

// Új edzés felülete
app.get('/workouts/new', (req, res) => {
  res.render('new_workout');
});

// Új edzés felvétele (hagyományos form beküldéssel)
app.post('/workouts', (req, res) => {
  const { date } = req.body;
  let exercises = [];
  if (req.body.exercises && Array.isArray(req.body.exercises)) {
    exercises = req.body.exercises;
  } else if (req.body.exercise && req.body.exerciseType && req.body.goal) {
    exercises.push({
      exercise: req.body.exercise,
      exerciseType: req.body.exerciseType,
      goal: req.body.goal
    });
  }

  if (!date || exercises.length === 0) {
    return res.status(400).send('Missing fields!');
  }

  const newWorkout = {
    id: Date.now(),
    date,
    exercises
  };
  workouts.push(newWorkout);
  res.redirect('/workouts');
});

// Edzés szerkesztés felülete
app.get('/workouts/:id/edit', (req, res) => {
  const workoutId = Number(req.params.id);
  const workout = workouts.find(w => w.id === workoutId);
  if (!workout) return res.status(404).send('Training not found!');
  res.render('edit_workout', { workout });
});

// Edzés frissítése
app.post('/workouts/:id/edit', (req, res) => {
  const workoutId = Number(req.params.id);
  const { date } = req.body;
  let exercises = [];
  if (req.body.exercises && Array.isArray(req.body.exercises)) {
    exercises = req.body.exercises;
  } else if (req.body.exercise && req.body.exerciseType && req.body.goal) {
    exercises.push({
      exercise: req.body.exercise,
      exerciseType: req.body.exerciseType,
      goal: req.body.goal
    });
  }
  if (!date || exercises.length === 0) {
    return res.status(400).send('Hiányzó mezők!');
  }
  const index = workouts.findIndex(w => w.id === workoutId);
  if (index === -1) return res.status(404).send('Training not found!');
  workouts[index] = { id: workoutId, date, exercises };
  res.redirect('/workouts');
});

// Edzés törlése
app.post('/workouts/:id/delete', (req, res) => {
  const workoutId = Number(req.params.id);
  workouts = workouts.filter(w => w.id !== workoutId);
  res.redirect('/workouts');
});

/* ======== CÉLOK (GOALS) ======== */
// Célok listázása
app.get('/goals', (req, res) => {
  res.render('goals', { goals });
});

// Új cél felülete
app.get('/goals/new', (req, res) => {
  res.render('new_goal');
});

// Új cél hozzáadása
app.post('/goals', (req, res) => {
  const { date, exercise, exerciseType, goal } = req.body;
  if (!date || !exercise || !exerciseType || !goal) {
    return res.status(400).send('Missing fields!');
  }
  const newGoal = { id: Date.now(), date, exercise, exerciseType, goal };
  goals.push(newGoal);
  res.redirect('/goals');
});

// Cél szerkesztés felülete
app.get('/goals/:id/edit', (req, res) => {
  const goalId = Number(req.params.id);
  const goalItem = goals.find(g => g.id === goalId);
  if (!goalItem) return res.status(404).send('Goal not found!');
  res.render('edit_goal', { goal: goalItem });
});

// Cél frissítése
app.post('/goals/:id/edit', (req, res) => {
  const goalId = Number(req.params.id);
  const { date, exercise, exerciseType, goal } = req.body;
  const index = goals.findIndex(g => g.id === goalId);
  if (index === -1) return res.status(404).send('Goal not found!');
  goals[index] = { id: goalId, date, exercise, exerciseType, goal };
  res.redirect('/goals');
});

// Cél törlése
app.post('/goals/:id/delete', (req, res) => {
  const goalId = Number(req.params.id);
  goals = goals.filter(g => g.id !== goalId);
  res.redirect('/goals');
});

/* ======== REKORDOK (RECORDS) ======== */
// Rekordok listázása
app.get('/records', (req, res) => {
  res.render('records', { records });
});

// Új rekord felülete
app.get('/records/new', (req, res) => {
  res.render('new_record');
});

// Új rekord hozzáadása
app.post('/records', (req, res) => {
  const { date, exercise, exerciseType, record } = req.body;
  if (!date || !exercise || !exerciseType || !record) {
    return res.status(400).send('Missing fields!');
  }
  const newRecord = { id: Date.now(), date, exercise, exerciseType, record };
  records.push(newRecord);
  res.redirect('/records');
});

// Rekord szerkesztés felülete
app.get('/records/:id/edit', (req, res) => {
  const recordId = Number(req.params.id);
  const rec = records.find(r => r.id === recordId);
  if (!rec) return res.status(404).send('Record not found!');
  res.render('edit_record', { record: rec });
});

// Rekord frissítése
app.post('/records/:id/edit', (req, res) => {
  const recordId = Number(req.params.id);
  const { date, exercise, exerciseType, record } = req.body;
  const index = records.findIndex(r => r.id === recordId);
  if (index === -1) return res.status(404).send('Record not found!');
  records[index] = { id: recordId, date, exercise, exerciseType, record };
  res.redirect('/records');
});

// Rekord törlése
app.post('/records/:id/delete', (req, res) => {
  const recordId = Number(req.params.id);
  records = records.filter(r => r.id !== recordId);
  res.redirect('/records');
});

/* ======== 404 HIBAKEZELÉS ======== */
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
