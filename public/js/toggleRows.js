function initToggleFunctionality() {
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains("toggle-icon")) {
      // A toggle logika itt.
      const row = e.target.closest("tr");
      let nextRow = row.nextElementSibling;
      while (nextRow && nextRow.classList.contains("hidden-row")) {
        nextRow.style.display = nextRow.style.display === "none" || nextRow.style.display === "" ? "table-row" : "none";
        nextRow = nextRow.nextElementSibling;
      }
      e.target.textContent = e.target.textContent === "▶" ? "▼" : "▶";
    }
  });
}
(function() {
  document.addEventListener('DOMContentLoaded', initToggleFunctionality);
})();
