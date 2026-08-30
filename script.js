// Split hero name into animated letters
function splitToLetters(el, text) {
  el.innerHTML = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.transitionDelay = `${i * 0.045}s`;
    el.appendChild(span);
  });
}

const line1 = document.getElementById("heroLine1");
const line2 = document.getElementById("heroLine2");
if (line1 && line2) {
  splitToLetters(line1, "Lavanya");
  splitToLetters(line2, "Pulijala");
}

// Trigger reveal shortly after load
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    setTimeout(() => document.body.classList.add("loaded"), 150);
  });
});

