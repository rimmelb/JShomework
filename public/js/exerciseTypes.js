document.addEventListener("DOMContentLoaded", function() {
  const exerciseTypes = {
    "Weightlifting": ["Bench Press", "Squat", "Deadlift", "Shoulder Press"],
    "Running": ["Distance", "Average Speed", "Time"],
    "Cycling": ["Distance", "Average Speed", "Time"],
    "Swimming": ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"]
  };

  
  function updateWorkoutTypes(exSelect, exTypeSelect) {
    const selected = exSelect.value;
    exTypeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    if (exerciseTypes[selected]) {
      exerciseTypes[selected].forEach(function(type) {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        exTypeSelect.appendChild(option);
      });
      const current = exTypeSelect.getAttribute("data-current");
      if (current) {
        exTypeSelect.value = current;
      }
    }
  }

  function initWorkoutExerciseFunctions() {
    const workoutExerciseSelects = document.querySelectorAll("select.exercise");
    workoutExerciseSelects.forEach(function(exSelect) {
      const fieldset = exSelect.closest("fieldset");
      if (!fieldset) return;
      const exTypeSelect = fieldset.querySelector("select.exerciseType");
      if (!exTypeSelect) return;
      exSelect.addEventListener("change", function() {
        updateWorkoutTypes(exSelect, exTypeSelect);
      });
      updateWorkoutTypes(exSelect, exTypeSelect);
    });
  }

  function initMainExerciseFunctions() {
    const mainExerciseSelect = document.getElementById("exercise");
    const mainExerciseTypeSelect = document.getElementById("exerciseType");
    if (mainExerciseSelect && mainExerciseTypeSelect) {
      mainExerciseSelect.addEventListener("change", function() {
        const selected = mainExerciseSelect.value;
        mainExerciseTypeSelect.innerHTML = '<option value="">-- Select Type --</option>';
        if (exerciseTypes[selected]) {
          exerciseTypes[selected].forEach(function(type) {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            mainExerciseTypeSelect.appendChild(option);
          });
          const current = mainExerciseTypeSelect.getAttribute("data-current");
          if (current) {
            mainExerciseTypeSelect.value = current;
          }
        }
      });
      // Trigger change event on load
      mainExerciseSelect.dispatchEvent(new Event("change"));
    }
  }

  // Inicializáljuk a funkciókat
  initWorkoutExerciseFunctions();
  initMainExerciseFunctions();
});
