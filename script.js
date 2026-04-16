// Nav: transparent on hero, solid + wordmark on scroll, hidden in contact
const nav = document.querySelector(".nav");
const contactSection = document.querySelector(".contact");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    nav.classList.add("is-scrolled");
  } else {
    nav.classList.remove("is-scrolled");
  }
}, { passive: true });

const contactIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      nav.classList.toggle("is-hidden", entry.isIntersecting);
    });
  },
  { threshold: 0.5 }
);
contactIO.observe(contactSection);

// Hamburger menu
const burger = document.querySelector(".nav__burger");
const navLinks = document.querySelector(".nav__links");

burger.addEventListener("click", () => {
  const open = burger.classList.toggle("is-open");
  navLinks.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

// Close menu on link click
document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
  });
});

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
const navLinkItems = document.querySelectorAll(".nav__links a");

const navIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinkItems.forEach((l) => {
          l.style.color = l.getAttribute("href") === "#" + id ? "var(--fg)" : "";
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((s) => navIO.observe(s));

// ============================================
// LIGHTBOX
// ============================================
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.innerHTML = `
  <button class="lightbox__close" aria-label="Fermer">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
  <div class="lightbox__inner">
    <img class="lightbox__img" src="" alt="">
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Précédent">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Suivant">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>
`;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector(".lightbox__img");
const lbClose = lightbox.querySelector(".lightbox__close");
const lbPrev = lightbox.querySelector(".lightbox__nav--prev");
const lbNext = lightbox.querySelector(".lightbox__nav--next");

let galleryImages = [];
let currentIndex = 0;

function openLightbox(images, index) {
  galleryImages = images;
  currentIndex = index;
  lbImg.src = galleryImages[currentIndex];
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
  updateNav();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => { lbImg.src = ""; }, 300);
}

function showImage(index) {
  lbImg.style.opacity = "0";
  setTimeout(() => {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[currentIndex];
    lbImg.style.opacity = "1";
    updateNav();
  }, 180);
}

function updateNav() {
  const show = galleryImages.length > 1;
  lbPrev.style.display = show ? "" : "none";
  lbNext.style.display = show ? "" : "none";
}

// Wire up all gallery images
document.querySelectorAll(".gallery figure").forEach((figure) => {
  const img = figure.querySelector("img");
  if (!img) return;
  figure.style.cursor = "zoom-in";
  figure.addEventListener("click", () => {
    // collect all images from the same gallery
    const gallery = figure.closest(".gallery");
    const imgs = Array.from(gallery.querySelectorAll("figure img")).map((i) => i.src);
    const index = imgs.indexOf(img.src);
    openLightbox(imgs, index);
  });
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => showImage(currentIndex - 1));
lbNext.addEventListener("click", () => showImage(currentIndex + 1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});
