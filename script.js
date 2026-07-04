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
const fadeEls = document.querySelectorAll(
  ".case-card, .feature-card, .about-card, .thinking-card, .contact-card, .stat-item, .hero-badges, .hero-name, .hero-desc"
);
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
  { threshold: 0.08 }
);
fadeEls.forEach((el, i) => {
  el.classList.add("fade-up");
  el.style.transitionDelay = (i % 4) * 60 + "ms";
  io.observe(el);
});

// Stagger case cards inside grid
document.querySelectorAll(".cases-grid .case-card").forEach((card, i) => {
  card.style.transitionDelay = (i % 3) * 80 + "ms";
});
