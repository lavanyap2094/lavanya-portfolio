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

// Project page lightbox
(function () {
  const holder = document.querySelector(".project-template-holder");
  if (!holder) return;

  const heroImg = holder.querySelector(".project-hero-image-holder img");
  const images = [...holder.querySelectorAll(".project-gallery img")];
  if (!images.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
    <div class="lightbox-main"><img class="lightbox-image" alt="" /></div>
    <button class="lightbox-next" aria-label="Next">&#8250;</button>
    <div class="lightbox-thumbs"></div>
  `;
  document.body.appendChild(lightbox);

  const mainImage = lightbox.querySelector(".lightbox-image");
  const thumbStrip = lightbox.querySelector(".lightbox-thumbs");

  images.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = "lightbox-thumb";
    thumb.addEventListener("click", () => show(i));
    thumbStrip.appendChild(thumb);

    img.style.cursor = "pointer";
    img.addEventListener("click", () => open(i));
  });

  if (heroImg) {
    heroImg.style.cursor = "pointer";
    heroImg.addEventListener("click", () => open(0));
  }

  let current = 0;

  function show(i) {
    current = (i + images.length) % images.length;
    mainImage.src = images[current].src;
    [...thumbStrip.children].forEach((t, idx) =>
      t.classList.toggle("active", idx === current)
    );
  }

  function open(i) {
    show(i);
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-locked");
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-locked");
  }

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();

// Scroll reveal animations for project pages
(function () {
  const targets = document.querySelectorAll(
    ".project-hero-image-holder, .project-info, .project-name-wrapper:not(.sticky), .project-gallery img, .project-body h3, .project-body p, .work-item, .featured-work-item, .about-title"
  );
  if (!targets.length) return;

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i % 8, 8) * 70}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
})();

