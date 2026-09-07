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

// Fade out hero scroll cue once the user starts scrolling
(function () {
  const cue = document.getElementById("heroScrollCue");
  if (!cue) return;
  const onScroll = () => {
    cue.classList.toggle("hidden", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Mobile menu toggle
(function () {
  const menuButton = document.querySelector(".menu-button");
  const navbar = document.querySelector(".navbar");
  const menuText = menuButton && menuButton.querySelector(".menu-text");
  if (!menuButton || !navbar) return;

  menuButton.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("menu-open");
    if (menuText) menuText.textContent = isOpen ? "Close" : "Menu";
  });

  navbar.querySelectorAll(".nav-link-big").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("menu-open");
      if (menuText) menuText.textContent = "Menu";
    });
  });
})();

// Smooth-scroll to in-page anchors (e.g. "About"). Closing the mobile menu
// shifts the page layout at the exact moment the browser tries to jump to
// the anchor, which was causing the scroll to get cancelled/skipped
// entirely on mobile. Handling the scroll manually, after the menu-close
// layout shift has settled, fixes that. Cross-page links (e.g. from
// work.html to index.html#about) land at the very top first, then glide
// down to the section, instead of snapping straight to it on page load.
(function () {
  function scrollToHash(hash) {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach((link) => {
    const url = new URL(link.getAttribute("href"), window.location.href);
    const isSamePage = url.pathname === window.location.pathname;
    if (!isSamePage || !url.hash) return;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => scrollToHash(url.hash), 50);
    });
  });

  if (window.location.hash) {
    const hash = window.location.hash;
    window.scrollTo(0, 0);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.addEventListener("load", () => {
      setTimeout(() => scrollToHash(hash), 700);
    });
  }
})();

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
  // Each selector gets its own stagger count, so unrelated groups
  // (e.g. the GROW letters vs. the work rail cards) never share an
  // index and step on each other's delays.
  const groups = [
    // Work rail cards (homepage) all appear together in one viewport, so
    // they need an index-based stagger to cascade one after another.
    { selector: ".work-item", step: 220 },
    // Work-page series list cards each scroll into view independently at
    // their own time, so no extra delay is added on top of that natural
    // stagger — otherwise later cards finish revealing well after they've
    // already scrolled into view and the wipe goes unseen.
    { selector: ".featured-work-item", step: 0 },
    { selector: ".about-title", step: 90 },
    { selector: ".story-title, .my-story-paragraph", step: 90 },
    { selector: ".project-hero-image-holder", step: 90 },
    { selector: ".project-info", step: 90 },
    { selector: ".project-name-wrapper:not(.sticky)", step: 90 },
    { selector: ".project-gallery img", step: 90 },
    { selector: ".project-body h3", step: 90 },
    { selector: ".project-body p", step: 90 },
    { selector: ".footer-contact, .footer-info-holder", step: 90 },
  ];

  const allTargets = [];
  groups.forEach(({ selector, step }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min(i, 8) * step}ms`;
      allTargets.push(el);
    });
  });

  if (!allTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    allTargets.forEach((el) => el.classList.add("revealed"));
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

  allTargets.forEach((el) => observer.observe(el));

  // Safety net: some mobile browsers can miss IntersectionObserver updates
  // during fast flick-scrolling inside a horizontally-scrolling container
  // (like the work rail), leaving a card stuck invisible forever. Directly
  // check visibility on scroll as a backup so nothing gets permanently stuck.
  document.querySelectorAll(".work-list-wrapper").forEach((wrapper) => {
    const checkVisible = () => {
      wrapper.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight) {
          el.classList.add("revealed");
        }
      });
    };
    wrapper.addEventListener("scroll", checkVisible, { passive: true });
    window.addEventListener("scroll", checkVisible, { passive: true });
  });
})();

