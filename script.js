document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");

  if (hamburgerMenu && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("nav-open");
      hamburgerMenu.setAttribute("aria-expanded", "false");
      hamburgerMenu.setAttribute("aria-label", "Abrir menú");
    };

    hamburgerMenu.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("nav-open");
      hamburgerMenu.setAttribute("aria-expanded", String(isOpen));
      hamburgerMenu.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("show"));
  }

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm && formMessage) {
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const setFormMessage = (message, color) => {
      formMessage.textContent = message;
      formMessage.style.color = color;
    };

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        setFormMessage("Completá todos los campos para enviar la consulta.", "#b42318");
        return;
      }

      if (!contactForm.checkValidity()) {
        setFormMessage("Revisá que el email esté escrito correctamente.", "#b42318");
        return;
      }

      setFormMessage("Enviando consulta...", "#8a5a00");

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: new FormData(contactForm),
        });

        const data = await response.json();

        if (response.ok) {
          setFormMessage("Consulta enviada. Te responderé a la brevedad.", "#157347");
          contactForm.reset();
        } else {
          const errorMessage = data.errors?.map((item) => item.message).join(" ") || data.error;
          setFormMessage(errorMessage || "No se pudo enviar la consulta. Probá nuevamente.", "#b42318");
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        setFormMessage("Error de conexión. También podés contactarme por WhatsApp.", "#b42318");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Enviar consulta";
        }
      }
    });
  }
});
