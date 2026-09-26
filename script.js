/* ============================================================
   CYBERSECURITY ANALYST PORTFOLIO — SCRIPT
   Handles: sticky/blur nav on scroll, mobile menu toggle,
   scroll-triggered reveal animations, active nav-link highlighting,
   animated stat counters, and contact form validation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav: add blur/background once scrolled ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after selecting a link
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll-triggered fade-in reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Active nav-link highlighting on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], main#top');
  const navAnchors = document.querySelectorAll('.nav-link[data-nav]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.5, rootMargin: '-70px 0px -40% 0px' });

  document.querySelectorAll('section[id]').forEach((sec) => sectionObserver.observe(sec));

  /* ---------- Animated stat counters (hero) ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statEls.forEach((el) => statObserver.observe(el));

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (v) => v.trim().length >= 2,
      message: 'Please enter your name (2+ characters).',
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'Please enter a valid email address.',
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (v) => v.trim().length >= 10,
      message: 'Message should be at least 10 characters.',
    },
  };

  const validateField = (key) => {
    const field = fields[key];
    const value = field.input.value;
    const valid = field.validate(value);
    field.input.closest('.form-group').classList.toggle('has-error', !valid);
    field.error.textContent = valid ? '' : field.message;
    return valid;
  };

  // Live validation as the user types/blurs
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
    fields[key].input.addEventListener('input', () => {
      if (fields[key].input.closest('.form-group').classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) {
      formStatus.style.color = '#ef4444';
      formStatus.textContent = 'Please fix the highlighted fields above.';
      return;
    }

    // No backend wired up — simulate a successful send for this static site.
    formStatus.style.color = 'var(--accent)';
    formStatus.textContent = 'Message sent. I typically respond within 1-2 business days.';
    form.reset();
    Object.keys(fields).forEach((key) => {
      fields[key].input.closest('.form-group').classList.remove('has-error');
      fields[key].error.textContent = '';
    });
  });

});
