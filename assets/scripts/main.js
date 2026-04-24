/**
 * MAIN JAVASCRIPT
 * Handles mobile menu, theme toggling, scroll animations, and form validation (API mock).
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initScrollAnimations();
  initYear();
  initContactForm();
});

/**
 * 1. Theme Toggle
 * Handles switching between light and dark modes, saves to localStorage.
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    htmlEl.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/**
 * 2. Mobile Navigation
 * Controls the hamburger menu and closes menu on link click.
 */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('.site-nav__link');

  if (!navToggle || !siteNav) return;

  function toggleMenu() {
    siteNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
  }

  navToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * 3. Scroll Spy & Header Effect
 * Updates active nav link on scroll and applies header shadow.
 */
function initScrollSpy() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.site-nav__link');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100; // Offset for header height

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 4. Scroll Animations (Reveal)
 * Uses IntersectionObserver to trigger CSS animations when elements come into view.
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const progressBars = document.querySelectorAll('.skill-bar__fill');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Specific logic for skill bars to trigger their width animation
        if (entry.target.classList.contains('skill-bar')) {
          const fill = entry.target.querySelector('.skill-bar__fill');
          const value = entry.target.querySelector('.skill-bar__track').getAttribute('aria-valuenow');
          if (fill) fill.style.width = value + '%';
        }

        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.1
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

/**
 * 5. Footer Year
 * Sets the current copyright year automatically.
 */
function initYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * 6. Contact Form Validation & Mock API Submission
 * Validates inputs and demonstrates how to connect to a backend API.
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.submit-text');
  const formIcon = submitBtn.querySelector('i');
  const spinner = submitBtn.querySelector('.spinner');
  const feedbackEl = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset groups
    const formGroups = form.querySelectorAll('.form__group');
    formGroups.forEach(group => group.classList.remove('invalid'));

    // Custom Validation
    const fullName = form.fullName;
    if (!fullName.value.trim() || fullName.value.length < 2) {
      fullName.closest('.form__group').classList.add('invalid');
      isValid = false;
    }

    const email = form.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.closest('.form__group').classList.add('invalid');
      isValid = false;
    }

    const subject = form.subject;
    if (!subject.value) {
      subject.closest('.form__group').classList.add('invalid');
      isValid = false;
    }

    const message = form.message;
    if (!message.value.trim() || message.value.length < 10) {
      message.closest('.form__group').classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;

    // Set Loading State
    btnText.style.display = 'none';
    formIcon.style.display = 'none';
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    feedbackEl.hidden = true;

    // Mock API Submission (Replace with actual fetch logic)
    const apiEndpoint = form.getAttribute('data-api-endpoint');
    const method = form.getAttribute('data-method');

    const formData = {
      fullName: fullName.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    };

    /**
     * Example Backend Integration setup:
     * 
     * try {
     *   const response = await fetch(apiEndpoint, {
     *     method: method,
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify(formData)
     *   });
     *   const result = await response.json();
     *   // handle success...
     * } catch (error) {
     *   // handle error...
     * }
     */

    // Simulate Network Request
    setTimeout(() => {
      // Restore Button State
      btnText.style.display = 'inline-block';
      formIcon.style.display = 'inline-block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;

      // Show Success Message
      feedbackEl.textContent = "Message sent successfully! I'll get back to you soon.";
      feedbackEl.className = 'form__feedback success';
      feedbackEl.hidden = false;

      // Reset Form
      form.reset();

      // Hide message after 5 seconds
      setTimeout(() => {
        feedbackEl.hidden = true;
      }, 5000);

    }, 1500);
  });
}
