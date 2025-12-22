document.addEventListener('DOMContentLoaded', () => {
    // Lógica existente para el menú de hamburguesa
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-open')) {
                    navLinks.classList.remove('nav-open');
                }
            });
        });
    }

    // Lógica para mostrar tarjetas con scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Lógica para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir el envío tradicional del formulario

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            formMessage.textContent = 'Enviando mensaje...';
            formMessage.style.color = 'orange';

            try {
                const response = await fetch('http://localhost:5000/contact', { // URL del backend Flask
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre: name, email, mensaje: message }),
                });

                const data = await response.json();

                if (response.ok) {
                    formMessage.textContent = data.message || 'Mensaje enviado con éxito.';
                    formMessage.style.color = 'green';
                    contactForm.reset(); // Limpiar el formulario
                } else {
                    formMessage.textContent = data.error || 'Error al enviar el mensaje.';
                    formMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                formMessage.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
                formMessage.style.color = 'red';
            }
        });
    }
});