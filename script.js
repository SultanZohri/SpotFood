document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".hero-btn");
  const fadeElements = document.querySelectorAll(".fade-in");
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // ==== Saat tombol ditekan, scroll dan tampilkan menu ====
  if (button) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = document.querySelector("#menu");

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          targetSection.classList.add("show");
        }, 400);
      }
    });
  }

  // ==== Saat di-scroll, otomatis tampilkan bagian yang terlihat ====
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 } // muncul saat 20% elemen terlihat
  );
  fadeElements.forEach((el) => observer.observe(el));

  // Ubah gaya navbar saat di-scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  function checkVisibility() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', checkVisibility);
  
  // Toggle menu garis tiga
  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("show");
  });
});

document.querySelector('.hero-btn').addEventListener('click', () => {
  const menuSection = document.querySelector('#menu');
  menuSection.scrollIntoView({ behavior: 'smooth' });
});
