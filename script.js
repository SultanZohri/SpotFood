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
    { threshold: 0.1 } // muncul saat 10% elemen terlihat
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
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        section.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkVisibility);
  window.addEventListener("load", checkVisibility);

  // Toggle menu garis tiga
  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("show");
  });
});

document.querySelector(".hero-btn").addEventListener("click", () => {
  const menuSection = document.querySelector("#menu");
  menuSection.scrollIntoView({ behavior: "smooth" });
});

function pesanSekarang(namaMenu, gambarMenu) {
  const encodedName = encodeURIComponent(namaMenu);
  const encodedImage = encodeURIComponent(gambarMenu);
  window.location.href = `pesanan/pesanan.html?menu=${encodedName}&img=${encodedImage}`;
}
// ==== SLIDER HERO OTOMATIS ====
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  let currentIndex = 0;

  // Buat dot sesuai jumlah slide
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      dots[i].classList.remove("active");
    });
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  // Ganti slide otomatis setiap 5 detik
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 5000);

  // Klik dot untuk ganti slide manual
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      showSlide(index);
    });
  });
});
