// GIRIMI Static Site - Shared JavaScript

// ===== INITIALIZE ICONS & CORE MODULES =====
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initScrollReveal();
    initThemeToggle();
    initMobileMenu();
    initBlobAnimation();
    initNavbarScroll();
    initScramble();
    initRoleRotate();
    initTilt();
    initScrollspy();
    initReadingProgress();
    initCodeCopy();
    initBackToTop();
    initDynamicYear();
    initGiscus();
    initCopyEmail();
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

    themeToggle.setAttribute('aria-label', '切换深色/浅色模式');

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
        syncGiscusTheme(isDark);
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (!menuBtn || !menu) return;

    menuBtn.setAttribute('aria-label', '切换导航菜单');
    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const isExpanded = !menu.classList.contains('hidden');
        menuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

        // 切换图标
        const icon = menuBtn.querySelector('i');
        if (!isExpanded) {
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
            menuBtn.setAttribute('aria-expanded', 'false');
            const icon = menuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
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

// ===== SCRAMBLE TEXT (data-scramble) =====
// Cycles each character through random glyphs, then resolves to the real text.
function initScramble() {
    const CHARS = '!<>-_\\/[]{}—=+*^?#________01';
    const targets = document.querySelectorAll('[data-scramble]');
    if (!targets.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function scramble(el) {
        if (el.dataset.scrambled === '1') return;
        el.dataset.scrambled = '1';

        const final = el.textContent;
        const len = final.length;
        const duration = 700;          // total
        const frameMs = 35;            // ~28 fps
        const totalFrames = Math.ceil(duration / frameMs);
        let frame = 0;

        // Preserve spaces; scramble everything else
        const queue = Array.from({ length: len }, (_, i) => ({
            from: '',
            to: final[i],
            start: Math.floor(Math.random() * totalFrames * 0.6),
            end: Math.floor(totalFrames * 0.4 + Math.random() * totalFrames * 0.6),
        }));

        function update() {
            let out = '';
            for (let i = 0; i < len; i++) {
                const q = queue[i];
                if (frame >= q.end) {
                    out += q.to;
                } else if (frame >= q.start) {
                    if (q.to === ' ') {
                        out += ' ';
                    } else {
                        out += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                } else {
                    out += final[i];
                }
            }
            el.textContent = out;
            if (frame < totalFrames) {
                frame++;
                setTimeout(update, frameMs);
            } else {
                el.textContent = final; // ensure exact final state
            }
        }

        if (prefersReduced) {
            el.textContent = final;
        } else {
            update();
        }
    }

    // Trigger when each target enters the viewport
    if (!('IntersectionObserver' in window)) {
        targets.forEach(scramble);
        return;
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scramble(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    targets.forEach(el => obs.observe(el));
}

// ===== ROLE ROTATE (data-roles) =====
// Cycles through a list of strings with a fade transition.
function initRoleRotate() {
    const targets = document.querySelectorAll('[data-roles]');
    if (!targets.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    targets.forEach(el => {
        // Read role list from data attribute, fall back to nothing
        let roles = [];
        try {
            roles = JSON.parse(el.getAttribute('data-roles-list') || '[]');
        } catch (e) {
            roles = [];
        }
        if (roles.length < 2) return;

        el.classList.add('role-fade-in');
        let idx = 0;

        if (prefersReduced) {
            el.textContent = roles[0];
            return;
        }

        setInterval(() => {
            idx = (idx + 1) % roles.length;
            el.classList.remove('role-fade-in');
            el.classList.add('role-fade-out');
            setTimeout(() => {
                el.textContent = roles[idx];
                el.classList.remove('role-fade-out');
                el.classList.add('role-fade-in');
            }, 220);
        }, 2400);
    });
}

// ===== 3D TILT (data-tilt) =====
// Subtle perspective tilt that follows the cursor.
function initTilt() {
    const targets = document.querySelectorAll('[data-tilt]');
    if (!targets.length) return;

    const supportsTouch = matchMedia('(hover: none)').matches;
    if (supportsTouch) return; // skip on touch devices

    const MAX = 7; // degrees

    targets.forEach(el => {
        let rect = null;
        let rafId = null;

        function apply(x, y) {
            if (!rect) rect = el.getBoundingClientRect();
            const px = (x - rect.left) / rect.width;   // 0..1
            const py = (y - rect.top) / rect.height;
            const rotY = (px - 0.5) * 2 * MAX;          // -MAX..MAX
            const rotX = (0.5 - py) * 2 * MAX;
            el.style.transform =
                `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`;
            rafId = null;
        }

        el.addEventListener('mousemove', (e) => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => apply(e.clientX, e.clientY));
        });

        el.addEventListener('mouseleave', () => {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            el.style.transform = '';
            rect = null;
        });

        // Recompute rect on resize/scroll so coords stay aligned
        window.addEventListener('scroll', () => { rect = null; }, { passive: true });
        window.addEventListener('resize', () => { rect = null; });
    });
}

// ===== SCROLLSPY (NAVBAR ACTIVE LINK) =====
function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function updateActiveNav() {
        const scrollY = window.scrollY;
        let activeId = '';

        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                activeId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('nav-link-active');
            } else {
                link.classList.remove('nav-link-active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
}

// ===== READING PROGRESS BAR =====
function initReadingProgress() {
    const article = document.querySelector('.blog-post-content, article');
    if (!article) return;

    let progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        document.body.appendChild(progressBar);
    }

    function updateProgress() {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
            progressBar.style.width = '0%';
            return;
        }
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ===== CODE COPY FUNCTIONALITY =====
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('.blog-post-content pre');
    if (!codeBlocks.length) return;

    codeBlocks.forEach(pre => {
        if (pre.parentElement && pre.parentElement.classList.contains('code-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.type = 'button';
        copyBtn.setAttribute('aria-label', '复制代码');
        copyBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i><span>复制</span>';

        copyBtn.addEventListener('click', async () => {
            const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
            try {
                await navigator.clipboard.writeText(code);
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i><span>已复制</span>';
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i data-lucide="copy" class="w-3.5 h-3.5"></i><span>复制</span>';
                    if (window.lucide) lucide.createIcons();
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        wrapper.appendChild(copyBtn);
    });

    if (window.lucide) lucide.createIcons();
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.className = 'back-to-top glass-panel text-slate-600 dark:text-slate-300';
        btn.setAttribute('aria-label', '返回顶部');
        btn.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
        document.body.appendChild(btn);
        if (window.lucide) lucide.createIcons();
    }

    function toggleBtn() {
        if (window.scrollY > 350) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();
}

// ===== DYNAMIC YEAR UPDATE =====
function initDynamicYear() {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('footer p').forEach(p => {
        p.innerHTML = p.innerHTML.replace(/20\d{2}/g, currentYear);
    });
}

// ===== GISCUS INTEGRATION & THEME SYNC =====
function initGiscus() {
    const container = document.querySelector('.giscus');
    if (!container) return;

    const isDark = document.documentElement.classList.contains('dark');
    const giscusTheme = isDark ? 'dark_dimmed' : 'light';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'kimo3412/kimo3412');
    script.setAttribute('data-repo-id', 'R_kgDOMu7xOA');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOMu7xOM4CkmF-');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);
}

function syncGiscusTheme(isDark) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    const theme = isDark ? 'dark_dimmed' : 'light';
    iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
    );
}

// ===== COPY EMAIL INTERACTION =====
function initCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'shanrzkimo@outlook.com';
        try {
            await navigator.clipboard.writeText(email);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check" class="w-5 h-5 text-green-500"></i><span class="text-green-600 dark:text-green-400">已复制邮箱</span>';
            if (window.lucide) lucide.createIcons();

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                if (window.lucide) lucide.createIcons();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
        }
    });
}



