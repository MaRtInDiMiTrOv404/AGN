/* ====================================================
   script.js — интерактивности за MAKISOFT
   - Плавно скролване
   - Hamburger (мобилно меню)
   - Филтриране на портфолиото
   - Intersection Observer за анимации при скрол
   - Обработка на контактната форма (локално)
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Плавно скролване за всички вътрешни линкове
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        // Затваряме мобилното меню ако е отворено
        closeMobileNav();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, null, `#${targetId}`);
      }
    });
  });

  /* -------------------------
     Hamburger (мобилна навигация)
     ------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  function openMobileNav(){
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav(){
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMobileNav();
      else openMobileNav();
    });
    // Allow keyboard toggling (Enter / Space)
    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = this.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMobileNav(); else openMobileNav();
      }
    });
  }

  // Затваряне на мобилното меню при клик върху вътрешен линк
  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => closeMobileNav());
  });

  /* -------------------------
     Intersection Observer — fade-in on scroll
     ------------------------- */
  const observerOptions = {
    threshold: 0.12
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // If element contains stagger children, apply incremental delays
        if (entry.target.matches('[data-stagger]') || entry.target.classList.contains('stagger')) {
          const children = Array.from(entry.target.children);
          children.forEach((child, idx) => {
            child.style.transitionDelay = (idx * 80) + 'ms';
            child.classList.add('stagger-item');
          });
        }

        entry.target.classList.add('in-view');
        // ако искаме да не наблюдаваме повече:
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  /* -------------------------
     Филтри за портфолиото
     ------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Активен клас
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = ''; // показва
          // Trigger repaint/animation if нужно
          card.classList.remove('is-hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* -------------------------
     Аккордеон (blog FAQ) — single-open поведение
     ------------------------- */
  document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.querySelectorAll('.accordion-toggle').forEach(toggle => {
      toggle.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Затваряме всички други панели в този акордеон (single-open)
        accordion.querySelectorAll('.accordion-toggle').forEach(t => {
          if (t !== this) {
            t.setAttribute('aria-expanded', 'false');
            const otherPanel = t.nextElementSibling;
            otherPanel.classList.remove('open');
            otherPanel.style.maxHeight = null;
          }
        });

        // Превключваме текущия
        this.setAttribute('aria-expanded', String(!isExpanded));
        const panel = this.nextElementSibling;
        if (!isExpanded) {
          panel.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.classList.remove('open');
          panel.style.maxHeight = null;
        }
      });
    });
  });

  /* -------------------------
     Обработка на формата (изпращане локално)
     ------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Проста валидация
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';

      if (!name.trim() || !email.trim() || !message.trim()) {
        formMessage.textContent = 'Моля, попълнете задължителните полета.';
        formMessage.style.color = '#f97316';
        return;
      }

      // Симулираме успешно изпращане (тук може да се добави AJAX)
      contactForm.reset();
      formMessage.textContent = 'Благодаря! Ще се свържем с вас скоро.';
      formMessage.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00bfa6';

      // За по-добро UX можем да махнем съобщението след няколко секунди
      setTimeout(() => {
        formMessage.textContent = '';
      }, 8000);
    });
  }

  /* -------------------------
     Placeholder: Подмяна на линкове към проекти
     ------------------------- */
  // В HTML има коментари // TODO: заменете href="#" с вашия линк към проекта
  // Можете да автоматизирате тук, ако имате JSON със сайтове — засега оставяме статичните плейсхолдъри.

  /* -------------------------
     CTA pulse — кратко анимираме основните call-to-action
     ------------------------- */
  /* -------------------------
     Theme toggle (light / dark)
     - saves preference to localStorage
     - respects system preference when no saved value
  ------------------------- */
  const themeToggle = document.querySelector('.theme-toggle');

  function applyTheme(theme){
    if (!theme) return;
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  }

  function initTheme(){
    const saved = localStorage.getItem('makisoft-theme');
    if (saved) { applyTheme(saved); return; }
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }

  if (themeToggle){
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('makisoft-theme', next);
    });
  }

  initTheme();
  const primaryCTAs = document.querySelectorAll('.btn-primary');
  if (primaryCTAs.length) {
    setTimeout(() => primaryCTAs.forEach(b => b.classList.add('pulse')), 600);
    setTimeout(() => primaryCTAs.forEach(b => b.classList.remove('pulse')), 5200);
  }
});
