// GIRIMI Static Site - Shared JavaScript

// ===== INITIALIZE ICONS =====
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initScrollReveal();
    initThemeToggle();
    initCustomCursor();
    initMagneticEffect();
    initBlobAnimation();
    initNavbarScroll();
});

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const html = document.documentElement;

    function updateThemeIcon(isDark) {
        themeToggle.innerHTML = isDark
            ? '<i data-lucide="sun" class="w-4 h-4"></i>'
            : '<i data-lucide="moon" class="w-4 h-4"></i>';
        lucide.createIcons();
    }

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursorCore = document.querySelector('.cursor-core');
    const cursorAura = document.querySelector('.cursor-aura');
    
    if (!cursorCore || !cursorAura) return;

    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        cursorCore.style.display = 'block';
        cursorAura.style.display = 'block';
        document.body.style.cursor = 'none';

        gsap.set(cursorCore, { xPercent: -50, yPercent: -50 });
        gsap.set(cursorAura, { xPercent: -50, yPercent: -50 });

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };
        const speed = 0.15;

        window.addEventListener("mousemove", e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            gsap.to(cursorCore, { x: mouse.x, y: mouse.y, duration: 0 });
        });

        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            gsap.set(cursorAura, { x: pos.x, y: pos.y });
        });
    }
}

// ===== MAGNETIC EFFECT =====
function initMagneticEffect() {
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.4,
                ease: 'power3.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
            document.body.classList.remove('hovering');
        });
    });
}

// ===== BLOB ANIMATION =====
function initBlobAnimation() {
    if (typeof gsap === 'undefined') return;
    
    gsap.to('.blob', {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        scale: "random(0.9, 1.1)",
        duration: "random(5, 10)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-glass', 'shadow-sm', 'py-4');
            nav.classList.remove('py-6');
        } else {
            nav.classList.remove('nav-glass', 'shadow-sm', 'py-4');
            nav.classList.add('py-6');
        }
    });
}
