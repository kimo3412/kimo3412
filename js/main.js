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
// Disabled per user request
function initMagneticEffect() {
    return; // Magnetic effect disabled
}

// ===== BLOB ANIMATION (FLUID BACKGROUND) =====
function initBlobAnimation() {
    if (typeof gsap === 'undefined') return;

    const blobs = document.querySelectorAll('.blob');

    blobs.forEach((blob, index) => {
        // Each blob has unique animation parameters
        const duration = 8 + index * 4;
        const delay = index * 0.8;

        // Primary fluid motion
        gsap.to(blob, {
            x: `random(-120, 120)`,
            y: `random(-120, 120)`,
            scale: `random(0.7, 1.3)`,
            duration: duration,
            delay: delay,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

        // Secondary layer for organic morphing
        gsap.to(blob, {
            opacity: 0.4 + index * 0.1,
            duration: duration * 1.5,
            delay: delay + 2,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
        });
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
