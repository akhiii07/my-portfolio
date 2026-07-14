// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Smooth scroll for scroll-down button
document.getElementById("scrollDown").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("marquee").scrollIntoView({ behavior: "smooth" });
});

// Active nav highlight on scroll
const sections = document.querySelectorAll("section[id]");
const links = navLinks.querySelectorAll("a[href^='#']");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 90) current = s.id;
  });
  links.forEach(link => {
    link.style.textDecoration = link.getAttribute("href") === "#" + current ? "underline" : "none";
  });
}, { passive: true });

// Fade-up on scroll (IntersectionObserver)
const fadeEls = document.querySelectorAll([
  ".case-card",
  ".feature-card",
  ".about-card",
  ".thinking-card",
  ".contact-card",
  ".stat-item",
  ".hero-badges",
  ".hero-name",
  ".hero-desc",
  ".impact-card",
  ".work-card",
  ".process-step",
  ".exp-card",
  ".skill-cat",
  ".pillar-card",
  ".philosophy-quote-block",
  ".philosophy-extended"
].join(", "));

const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }),
  { threshold: 0.06 }
);

fadeEls.forEach((el, i) => {
  el.classList.add("fade-up");
  el.style.transitionDelay = (i % 4) * 55 + "ms";
  io.observe(el);
});

// Stagger cards inside grids
[".work-grid", ".impact-grid", ".skills-grid", ".philosophy-pillars"].forEach(selector => {
  document.querySelectorAll(selector + " > *").forEach((card, i) => {
    card.style.transitionDelay = Math.min(i * 70, 280) + "ms";
  });
});

// Process steps stagger
document.querySelectorAll(".process-step").forEach((step, i) => {
  step.style.transitionDelay = i * 80 + "ms";
});

// ===== SWIPE DECK =====
(function () {
  const deck = document.getElementById("swipeDeck");
  if (!deck) return;

  const wrapper = deck.closest(".swipe-deck-wrapper");
  const counter = document.getElementById("swipeCounter");
  const btnOpen = document.getElementById("btnOpenCase");
  const btnNext = document.getElementById("btnNextCase");

  const cards = Array.from(deck.querySelectorAll(".swipe-card"));
  const total = cards.length;
  let activeIdx = 0;

  // Drag state
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let currentDX = 0;
  let isAnimating = false;

  const SWIPE_THRESHOLD = 80;

  function updateDepths() {
    cards.forEach((card, i) => {
      card.classList.remove("depth-1", "depth-2", "depth-hidden");
      card.style.zIndex = "";
      // Restore transform if not currently being dragged
      if (i !== activeIdx) card.style.transform = "";

      const rel = (i - activeIdx + total) % total;
      if (rel === 0) {
        card.style.zIndex = 10;
      } else if (rel === 1) {
        card.classList.add("depth-1");
      } else if (rel === 2) {
        card.classList.add("depth-2");
      } else {
        card.classList.add("depth-hidden");
      }
    });
    if (counter) counter.textContent = (activeIdx + 1) + " / " + total;
  }

  function activeCard() {
    return cards[activeIdx % total];
  }

  function flyOut(direction, url) {
    if (isAnimating) return;
    isAnimating = true;

    const card = activeCard();
    const flyX = direction === "left" ? "-160%" : "160%";
    const rot  = direction === "left" ? "-28deg" : "28deg";

    card.style.transition = "transform 0.42s ease, opacity 0.3s ease";
    card.style.transform  = "translateX(" + flyX + ") rotate(" + rot + ")";
    card.style.opacity    = "0";

    // Hide hints
    setHintOpacity(card, 0, 0);

    if (direction === "left" && url) {
      setTimeout(() => window.open(url, "_blank"), 80);
    }

    setTimeout(() => {
      card.style.transition = "none";
      card.style.transform  = "";
      card.style.opacity    = "";
      card.style.zIndex     = "";
      activeIdx = (activeIdx + 1) % total;
      updateDepths();
      isAnimating = false;
    }, 440);
  }

  function setHintOpacity(card, leftOp, rightOp) {
    const hl = card.querySelector(".swipe-hint-left");
    const hr = card.querySelector(".swipe-hint-right");
    if (hl) hl.style.opacity = leftOp;
    if (hr) hr.style.opacity = rightOp;
  }

  // ── Pointer / Touch events ──────────────────────────────────────
  function onStart(e) {
    if (isAnimating) return;
    const card = activeCard();
    const target = e.target.closest(".swipe-card");
    if (!target || target !== card) return;

    dragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    currentDX = 0;
    card.style.transition = "none";
  }

  function onMove(e) {
    if (!dragging) return;
    const pt = e.touches ? e.touches[0] : e;
    currentDX = pt.clientX - startX;
    const currentDY = pt.clientY - startY;

    // If mostly vertical scroll, cancel drag
    if (Math.abs(currentDY) > Math.abs(currentDX) * 1.5 && Math.abs(currentDX) < 20) {
      dragging = false;
      return;
    }

    if (e.cancelable) e.preventDefault();

    const rot = currentDX * 0.05;
    const card = activeCard();
    card.style.transform = "translateX(" + currentDX + "px) rotate(" + rot + "deg)";

    const leftOp  = currentDX < -20 ? Math.min(1, Math.abs(currentDX) / SWIPE_THRESHOLD) : 0;
    const rightOp = currentDX >  20 ? Math.min(1, currentDX / SWIPE_THRESHOLD) : 0;
    setHintOpacity(card, leftOp, rightOp);
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    const card = activeCard();

    setHintOpacity(card, 0, 0);

    if (currentDX < -SWIPE_THRESHOLD) {
      flyOut("left", card.dataset.url);
    } else if (currentDX > SWIPE_THRESHOLD) {
      flyOut("right", null);
    } else {
      // Snap back
      card.style.transition = "transform 0.3s ease";
      card.style.transform  = "";
      setTimeout(() => { card.style.transition = "none"; }, 320);
    }
    currentDX = 0;
  }

  // Mouse
  deck.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onEnd);

  // Touch
  deck.addEventListener("touchstart", onStart, { passive: true });
  deck.addEventListener("touchmove", onMove, { passive: false });
  deck.addEventListener("touchend", onEnd);

  // Buttons
  if (btnOpen) btnOpen.addEventListener("click", () => {
    const card = activeCard();
    flyOut("left", card.dataset.url);
  });
  if (btnNext) btnNext.addEventListener("click", () => flyOut("right", null));

  // Init
  updateDepths();
})();
