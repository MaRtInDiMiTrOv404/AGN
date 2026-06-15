/* ====================================================
   script.js — MAKISOFT 2026
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     ТЕМА (тъмна / светла)
  ───────────────────────────────────────── */
  const themeToggle = document.querySelector('.theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  }

  function initTheme() {
    const saved = localStorage.getItem('makisoft-theme');
    applyTheme(saved || 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('makisoft-theme', next);
    });
  }

  initTheme();

  /* ─────────────────────────────────────────
     HEADER SCROLL EFFECT
  ───────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  function updateHeader() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ─────────────────────────────────────────
     МОБИЛНА НАВИГАЦИЯ — ПОПРАВЕН БЪГ
  ───────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  function openMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMobileNav();
      else openMobileNav();
    });
  }

  // Затваряне при клик върху линк
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Затваряне при клик извън менюто
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target === this) closeMobileNav();
    });
  }

  // Затваряне с Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ─────────────────────────────────────────
     ПЛАВНО СКРОЛВАНЕ
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        closeMobileNav();
        const headerH = header ? header.offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, null, `#${id}`);
      }
    });
  });

  /* ─────────────────────────────────────────
     АКТИВЕН НАВ ЛИНК ПРИ СКРОЛ
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ─────────────────────────────────────────
     SCROLL ANIMATIONS
  ───────────────────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ─────────────────────────────────────────
     ПОРТФОЛИО ФИЛТРИ
  ───────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      portfolioCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ─────────────────────────────────────────
     КОНТАКТНА ФОРМА
  ───────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const email = (data.get('email') || '').trim();
      const message = (data.get('message') || '').trim();

      if (!name || !email || !message) {
        formMsg.textContent = '⚠ Моля, попълнете всички задължителни полета.';
        formMsg.style.color = '#f97316';
        return;
      }

      form.reset();
      formMsg.textContent = '✓ Благодаря! Ще се свържем с вас в рамките на 24 часа.';
      formMsg.style.color = '#00e5c8';
      setTimeout(() => { formMsg.textContent = ''; }, 8000);
    });
  }

  /* ─────────────────────────────────────────
     АККОРДЕОН (блог)
  ───────────────────────────────────────── */
  document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.querySelectorAll('.accordion-toggle').forEach(toggle => {
      toggle.addEventListener('click', function () {
        const isExp = this.getAttribute('aria-expanded') === 'true';
        accordion.querySelectorAll('.accordion-toggle').forEach(t => {
          if (t !== this) {
            t.setAttribute('aria-expanded', 'false');
            const p = t.nextElementSibling;
            if (p) { p.classList.remove('open'); p.style.maxHeight = null; }
          }
        });
        this.setAttribute('aria-expanded', String(!isExp));
        const panel = this.nextElementSibling;
        if (panel) {
          if (!isExp) { panel.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
          else { panel.classList.remove('open'); panel.style.maxHeight = null; }
        }
      });
    });
  });

  /* ─────────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────────── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const isPlus = String(target).includes('+');
    const num = parseInt(String(target).replace('+', ''));
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * num) + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.count;
        if (target) animateCounter(el, target, 1800);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-value[data-count]').forEach(el => statObserver.observe(el));
});
