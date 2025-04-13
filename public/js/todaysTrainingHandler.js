async function fetchTodaysWorkouts() {
    try {
      const response = await fetch('/home/api/todays-workouts');
      const data = await response.json();
      return data.todaysWorkouts || [];
    } catch (err) {
      console.error("Hiba az adatok lekérésekor:", err);
      return [];
    }
  }

  async function updateTrainingTable() {
    const todaysWorkouts = await fetchTodaysWorkouts();
    const container = document.getElementById('trainingContainer');
    // Töröljük a korábbi tartalmat
    container.innerHTML = '';

    if (todaysWorkouts.length > 0) {
      // Létrehozzuk a táblázatot
      const table = document.createElement('table');
      table.id = 'trainingTable';
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>Exercise</th>
          <th>Type of Exercise</th>
          <th>Goal</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      todaysWorkouts.forEach(workout => {
        workout.exercises.forEach(ex => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${ex.exercise}</td><td>${ex.exerciseType}</td><td>${ex.goal}</td>`;
          tbody.appendChild(row);
        });
      });
      table.appendChild(tbody);
      container.appendChild(table);
    } else {
      // Ha nincs training
      container.innerHTML = '<p id="noTrainingMsg">Nincs ma rögzített training.</p>';
    }
  }

  // Polling: pl. 30 másodpercenként frissítjük az adatokat
  setInterval(updateTrainingTable, 30000);
  // Az oldal betöltésekor is frissítjük a táblázatot:
  updateTrainingTable();