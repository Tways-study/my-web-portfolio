'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ─── Custom Cursor with lerp smoothing ───
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    (function animateCursor() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateCursor);
    })();

    const interactives = document.querySelectorAll(
        'a, button, .tag, .pill, .social-btn, .project-row, .marquee-item'
    );
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    // ─── Navbar: scroll state + active section tracking ───
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 130) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ─── Scroll Progress Bar ───
    const scrollProgress = document.querySelector('.scroll-progress');

    function updateScrollProgress() {
        if (!scrollProgress) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = Math.min((window.scrollY / docHeight) * 100, 100);
        scrollProgress.style.height = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ─── Stat Counter Animation ───
    function animateCount(el, target, duration) {
        const startTime = performance.now();
        (function step(now) {
            const elapsed  = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        })(startTime);
    }

    // ─── IntersectionObserver: Scroll Reveals ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Section Rule Line Animation ───
    const ruleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s';
                entry.target.style.transform  = 'scaleX(1)';
                ruleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-rule').forEach(rule => ruleObserver.observe(rule));

    // ─── Stat Counters ───
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('[data-target]').forEach(num => {
                    animateCount(num, parseInt(num.dataset.target, 10), 1400);
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statObserver.observe(heroStats);

    // ─── Project Rows: Staggered slide-in from right ───
    const projectRows = document.querySelectorAll('.project-row');

    projectRows.forEach(row => {
        row.style.opacity   = '0';
        row.style.transform = 'translateX(50px)';
    });

    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rows  = [...projectRows];
                const idx   = rows.indexOf(entry.target);
                const delay = idx * 80;

                entry.target.style.transition =
                    `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateX(0)';

                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    projectRows.forEach(row => projectObserver.observe(row));

    // ─── Contact Form Handler ───
    window.handleFormSubmit = function(e) {
        e.preventDefault();
        const btn = e.target.querySelector('.submit-btn');
        const originalHTML = btn.innerHTML;

        btn.textContent      = 'Message Sent \u2713';
        btn.style.background = '#34d399';
        btn.style.boxShadow  = '0 8px 24px rgba(52, 211, 153, 0.3)';

        setTimeout(() => {
            btn.innerHTML        = originalHTML;
            btn.style.background = '';
            btn.style.boxShadow  = '';
            e.target.reset();
        }, 3500);
    };

    // ─── Marquee pause on hover ───
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }

    // ─── Keyboard a11y: hide custom cursor on Tab ───
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            dot.style.display  = 'none';
            ring.style.display = 'none';
        }
    });
    document.addEventListener('mousemove', () => {
        dot.style.display  = '';
        ring.style.display = '';
    });

});
