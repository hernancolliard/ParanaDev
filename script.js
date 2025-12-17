      const cards = document.querySelectorAll(".card");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
            }
          });
        },
        { threshold: 0.2 }
      );

      cards.forEach((card) => observer.observe(card));

      // JavaScript para el menú de hamburguesa
      const hamburgerButton = document.getElementById("hamburger-menu");
      const navLinks = document.getElementById("nav-links");

      hamburgerButton.addEventListener("click", () => {
        navLinks.classList.toggle("nav-open");
      });