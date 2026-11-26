/* ===== Тёмная тема ===== */
(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Переключатель темы
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        updateToggleIcon(toggle);
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateToggleIcon(toggle);
        });
    }

    function updateToggleIcon(btn) {
        btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    }

    /* ===== Анимация счётчиков (главная) ===== */
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const animateCounter = (el) => {
            const target = +el.dataset.target;
            const duration = 1500;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.floor(progress * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    /* ===== Валидация формы (контакты) ===== */
    const form = document.getElementById('contactForm');
    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const successMsg = document.getElementById('successMsg');

        const setError = (input, errorEl, message) => {
            input.classList.add('invalid');
            errorEl.textContent = message;
        };

        const clearError = (input, errorEl) => {
            input.classList.remove('invalid');
            errorEl.textContent = '';
        };

        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            successMsg.classList.remove('show');

            // Имя
            if (nameInput.value.trim().length < 2) {
                setError(nameInput, document.getElementById('nameError'), 'Введите имя (минимум 2 символа)');
                valid = false;
            } else {
                clearError(nameInput, document.getElementById('nameError'));
            }

            // Email
            if (!validateEmail(emailInput.value.trim())) {
                setError(emailInput, document.getElementById('emailError'), 'Введите корректный email');
                valid = false;
            } else {
                clearError(emailInput, document.getElementById('emailError'));
            }

            // Сообщение
            if (messageInput.value.trim().length < 10) {
                setError(messageInput, document.getElementById('messageError'), 'Сообщение должно быть не короче 10 символов');
                valid = false;
            } else {
                clearError(messageInput, document.getElementById('messageError'));
            }

            if (valid) {
                successMsg.classList.add('show');
                form.reset();
                setTimeout(() => successMsg.classList.remove('show'), 5000);
            }
        });

        // Сброс ошибок при вводе
        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('invalid');
                const errorEl = input.parentElement.querySelector('.error');
                if (errorEl) errorEl.textContent = '';
            });
        });
    }
});