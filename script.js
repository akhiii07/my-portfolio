// Typed text animation
const phrases = [
  "Full-Stack Developer",
  "Fintech Builder",
  "AI Product Tinkerer",
  "Open Source Contributor"
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById("typed-text");

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 90);
}
type();

// Nav scroll state
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
  { threshold: 0.1 }
);
document.querySelectorAll(".stat-card, .project-card, .skill-group, .contact-card, .about-text, .about-stats")
  .forEach(el => { el.classList.add("fade-in"); observer.observe(el); });
