document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("multi-step-form");
  const steps = form.querySelectorAll(".step");
  let presentStep = 1;

  function showStep(step) {
    steps.forEach((section) => {
      section.style.display = section.dataset.step == step ? "block" : "none";
    });
  }

  form.addEventListener("click", (e) => {
    const action = e.target.dataset.action;

    if (action === "next" && presentStep < steps.length) {
      presentStep++;
    } else if (action === "prev" && presentStep > 1) {
      presentStep--;
    }

    showStep(presentStep);
  });

  showStep(presentStep);
});
