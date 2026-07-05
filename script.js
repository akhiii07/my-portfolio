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
  ".library-card",
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
[".work-grid", ".impact-grid", ".library-grid", ".skills-grid", ".philosophy-pillars"].forEach(selector => {
  document.querySelectorAll(selector + " > *").forEach((card, i) => {
    // use i directly (no modulo) so stagger always increases; cap at 280ms
    card.style.transitionDelay = Math.min(i * 70, 280) + "ms";
  });
});

// Process steps stagger
document.querySelectorAll(".process-step").forEach((step, i) => {
  step.style.transitionDelay = i * 80 + "ms";
});
