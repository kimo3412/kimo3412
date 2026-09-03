// GIRIMI Static Site - Shared JavaScript

// ===== INITIALIZE ICONS & CORE MODULES =====
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initBrandIcons();
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
    initMouseSpotlight();
    initCommandPalette();
    initConsoleEasterEgg();
});

// ===== SCROLL REVEAL (Fast & Robust) =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    function checkInitialVisibility() {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= vh + 80) {
                el.classList.add('active');
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 120px 0px'
    });

    reveals.forEach(el => observer.observe(el));
    checkInitialVisibility();
    window.addEventListener('scroll', checkInitialVisibility, { passive: true });
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

// ===== BRAND ICONS POLYFILL (GitHub & Socials) =====
function initBrandIcons() {
    const GITHUB_SVG = '<svg class="w-full h-full fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>';

    document.querySelectorAll('[data-lucide="github"]').forEach(el => {
        const wrapper = document.createElement('span');
        wrapper.className = el.className;
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.innerHTML = GITHUB_SVG;
        el.parentNode.replaceChild(wrapper, el);
    });
}

// ===== INTERACTIVE MOUSE SPOTLIGHT =====
function initMouseSpotlight() {
    let spotlight = document.querySelector('.mouse-spotlight');
    if (!spotlight) {
        spotlight = document.createElement('div');
        spotlight.className = 'mouse-spotlight';
        document.body.prepend(spotlight);
    }

    let rafId = null;
    window.addEventListener('pointermove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
            spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
            if (!spotlight.classList.contains('active')) {
                spotlight.classList.add('active');
            }
        });
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        spotlight.classList.remove('active');
    });
}

// ===== COMMAND PALETTE (Cmd+K / Ctrl+K) =====
function initCommandPalette() {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

    // 动态创建命令面板结构
    const paletteBackdrop = document.createElement('div');
    paletteBackdrop.id = 'cmd-palette';
    paletteBackdrop.className = 'cmd-palette-backdrop';
    paletteBackdrop.innerHTML = `
        <div class="cmd-palette-modal glass-panel" role="dialog" aria-modal="true">
            <div class="p-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <i data-lucide="search" class="w-5 h-5 text-primary-500 shrink-0"></i>
                <input id="cmd-input" type="text" placeholder="输入搜索指令或直接跳转... (ESC 关闭)" 
                    class="w-full bg-transparent border-none outline-none text-base text-slate-800 dark:text-slate-100 placeholder-slate-400">
                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200/60 dark:bg-zinc-800 text-slate-500 shrink-0">ESC</span>
            </div>
            <div id="cmd-list" class="max-h-72 overflow-y-auto p-2 space-y-1">
                <div class="cmd-item p-3 rounded-xl flex items-center justify-between selected" data-action="unredo">
                    <div class="flex items-center gap-3">
                        <i data-lucide="terminal" class="w-4 h-4 text-emerald-500"></i>
                        <span class="text-sm font-semibold">Unredo (Go CLI 开源项目)</span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">GitHub 仓库</span>
                </div>
                <div class="cmd-item p-3 rounded-xl flex items-center justify-between" data-action="blog">
                    <div class="flex items-center gap-3">
                        <i data-lucide="book-open" class="w-4 h-4 text-pink-500"></i>
                        <span class="text-sm font-semibold">赛博废话档案馆</span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">技术博客</span>
                </div>
                <div class="cmd-item p-3 rounded-xl flex items-center justify-between" data-action="theme">
                    <div class="flex items-center gap-3">
                        <i data-lucide="sun-moon" class="w-4 h-4 text-amber-500"></i>
                        <span class="text-sm font-semibold">切换深色 / 浅色模式</span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">主题换肤</span>
                </div>
                <div class="cmd-item p-3 rounded-xl flex items-center justify-between" data-action="email">
                    <div class="flex items-center gap-3">
                        <i data-lucide="mail" class="w-4 h-4 text-blue-500"></i>
                        <span class="text-sm font-semibold">复制作者联系邮箱</span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">shanrzkimo@outlook.com</span>
                </div>
            </div>
            <div class="p-3 bg-slate-100/50 dark:bg-zinc-900/50 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Navigate ↑↓  •  Select Enter</span>
                <span>GIRIMI Command System</span>
            </div>
        </div>
    `;
    document.body.appendChild(paletteBackdrop);
    if (window.lucide) lucide.createIcons();

    const input = paletteBackdrop.querySelector('#cmd-input');
    const items = paletteBackdrop.querySelectorAll('.cmd-item');

    function openPalette() {
        paletteBackdrop.classList.add('open');
        input.value = '';
        input.focus();
        filterItems('');
    }

    function closePalette() {
        paletteBackdrop.classList.remove('open');
    }

    function filterItems(query) {
        const q = query.toLowerCase().trim();
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(q) ? 'flex' : 'none';
        });
        const visible = Array.from(items).filter(i => i.style.display !== 'none');
        items.forEach(i => i.classList.remove('selected'));
        if (visible.length > 0) visible[0].classList.add('selected');
    }

    function executeAction(action) {
        closePalette();
        switch (action) {
            case 'unredo':
                window.open('https://github.com/kimo3412/Unredo', '_blank');
                break;
            case 'blog':
                window.location.href = window.location.pathname.includes('/blog/') ? 'index.html' : 'blog/index.html';
                break;
            case 'theme':
                const themeBtn = document.getElementById('theme-toggle');
                if (themeBtn) themeBtn.click();
                break;
            case 'email':
                navigator.clipboard.writeText('shanrzkimo@outlook.com');
                const copyBtn = document.getElementById('copy-email-btn');
                if (copyBtn) copyBtn.click();
                break;
        }
    }

    // 快捷键监听
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            paletteBackdrop.classList.contains('open') ? closePalette() : openPalette();
        } else if (e.key === 'Escape' && paletteBackdrop.classList.contains('open')) {
            closePalette();
        }
    });

    paletteBackdrop.addEventListener('click', (e) => {
        if (e.target === paletteBackdrop) closePalette();
    });

    input.addEventListener('input', (e) => filterItems(e.target.value));

    items.forEach(item => {
        item.addEventListener('click', () => executeAction(item.getAttribute('data-action')));
    });
}

// ===== CONSOLE EASTER EGG (F12 ASCII Art) =====
function initConsoleEasterEgg() {
    const banner = `
%c  ____ ___ ____  ___ __  __ ___ 
 / ___|_ _|  _ \\|_ _|  \\/  |_ _|
| |  _ | || |_) || || |\\/| || | 
| |_| || ||  _ < | || |  | || | 
 \\____|___|_| \\_\\___|_|  |_|___|
    `;
    console.log(
        banner,
        'color: #ec4899; font-weight: bold; font-family: monospace; font-size: 13px;'
    );
    console.log(
        '%c🚀 Welcome to GIRIMI\'s Cyber Space! Built with Pure Logic & Passion. \n👉 GitHub: https://github.com/kimo3412',
        'color: #f472b6; font-size: 12px; font-weight: 500;'
    );
}





