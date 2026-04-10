// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal-on-scroll for sections
const revealables = document.querySelectorAll(
  ".section, .project, .contact, .gallery figure, .member, .quote"
);
revealables.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

revealables.forEach((el) => io.observe(el));

// Smooth nav highlight on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__links a");

const navIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((l) => {
          l.style.color = l.getAttribute("href") === "#" + id ? "var(--fg)" : "";
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((s) => navIO.observe(s));
