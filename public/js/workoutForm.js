document.addEventListener('DOMContentLoaded', function() {
    if (typeof exerciseOptions === 'undefined') {
      window.exerciseOptions = ["Weightlifting", "Running", "Cycling", "Swimming"];
    }
  
    const addExerciseBtn = document.getElementById('addExerciseBtn');
    const exercisesContainer = document.getElementById('exercisesContainer');
  
    addExerciseBtn.addEventListener('click', function() {
      const fieldsets = exercisesContainer.getElementsByClassName('exerciseGroup');
      const newIndex = fieldsets.length;
      
      // Új fieldset létrehozása
      const fieldset = document.createElement('fieldset');
      fieldset.classList.add('exerciseGroup');
      
      // Legend létrehozása
      const legend = document.createElement('legend');
      legend.textContent = 'Exercise Group ' + (newIndex + 1);
      fieldset.appendChild(legend);
      
      // Exercise select létrehozása
      const labelExercise = document.createElement('label');
      labelExercise.textContent = 'Exercise:';
      fieldset.appendChild(labelExercise);
      
      const exerciseSelect = document.createElement('select');
      exerciseSelect.name = 'exercise[]';
      exerciseSelect.classList.add('exercise');
      exerciseSelect.required = true;
      exerciseSelect.innerHTML = '<option value="">-- Select Exercise --</option>';
      exerciseOptions.forEach(function(opt) {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        exerciseSelect.appendChild(option);
      });
      fieldset.appendChild(exerciseSelect);
      fieldset.appendChild(document.createElement('br'));
      
      // Exercise Type select létrehozása
      const labelType = document.createElement('label');
      labelType.textContent = 'Exercise Type:';
      fieldset.appendChild(labelType);
      
      const typeSelect = document.createElement('select');
      typeSelect.name = 'exerciseType[]';
      typeSelect.classList.add('exerciseType');
      typeSelect.required = true;
      typeSelect.setAttribute('data-current', '');
      typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
      fieldset.appendChild(typeSelect);
      fieldset.appendChild(document.createElement('br'));
      
      // Goal input létrehozása
      const labelGoal = document.createElement('label');
      labelGoal.textContent = 'Goal:';
      fieldset.appendChild(labelGoal);
      
      const goalInput = document.createElement('input');
      goalInput.name = 'goal[]';
      goalInput.type = 'text';
      goalInput.required = true;
      fieldset.appendChild(goalInput);
      
      // Új fieldset hozzáadása a konténerhez
      exercisesContainer.appendChild(fieldset);
      exercisesContainer.appendChild(document.createElement('br'));
      
      // Kötjük az exercise select change eseményét a típusok dinamikus feltöltéséhez
      exerciseSelect.addEventListener('change', function() {
        if (typeof updateWorkoutTypes === 'function') {
          updateWorkoutTypes(exerciseSelect, typeSelect);
        }
      });
    });
  });
  