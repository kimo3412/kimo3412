// GIRIMI Static Site - Shared JavaScript

// ===== INITIALIZE ICONS =====
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initScrollReveal();
    initThemeToggle();
    initMobileMenu();
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

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');

        // 切换图标
        const icon = menuBtn.querySelector('i');
        if (menu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'menu');
        } else {
            icon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });

    // 点击菜单链接后关闭菜单
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            const icon = menuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
}

// ===== CUSTOM CURSOR =====
// Disabled - using default browser cursor
function initCustomCursor() {
    return;
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
