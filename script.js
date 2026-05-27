const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id], main[id]")];
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const cursorLight = document.querySelector(".cursor-light");
const heroMedia = document.querySelector(".hero-media");

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-28% 0px -62% 0px", threshold: [0.1, 0.35, 0.7] }
);

sections.forEach((section) => sectionObserver.observe(section));

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
    });
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
  });
});

document.querySelectorAll("[data-gallery-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.galleryTab;
    document.querySelectorAll("[data-gallery-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
    });
    document.querySelectorAll("[data-gallery]").forEach((item) => {
      item.hidden = item.dataset.gallery !== target;
    });
  });
});

document.querySelectorAll("[data-image]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.image;
    lightbox.showModal();
  });
});

document.querySelector("[data-close]").addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

window.addEventListener("pointermove", (event) => {
  document.body.classList.add("cursor-ready");
  cursorLight.style.left = `${event.clientX}px`;
  cursorLight.style.top = `${event.clientY}px`;
});

window.addEventListener("pointerleave", () => {
  document.body.classList.remove("cursor-ready");
});

heroMedia.addEventListener("pointermove", (event) => {
  const rect = heroMedia.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  heroMedia.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 7}deg)`;
});

heroMedia.addEventListener("pointerleave", () => {
  heroMedia.style.transform = "";
});
