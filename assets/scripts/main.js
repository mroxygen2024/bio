/**
 * MAIN JAVASCRIPT
 * Handles mobile menu, theme toggling, scroll animations, and dynamic API integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initScrollAnimations();
  initYear();
  initProjects();
  initContactForm();
});

/**
 * 1. Theme Toggle
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

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
 */
function initScrollSpy() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.site-nav__link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;

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
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        if (entry.target.classList.contains('skill-bar')) {
          const fill = entry.target.querySelector('.skill-bar__fill');
          const value = entry.target.querySelector('.skill-bar__track').getAttribute('aria-valuenow');
          if (fill) fill.style.width = value + '%';
        }

        observer.unobserve(entry.target);
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
 */
function initYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * 6. Dynamic Projects Fetching
 * Fetches project data from the PHP MongoDB backend.
 */
async function initProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  const apiResource = container.getAttribute('data-api-resource');
  if (!apiResource) return;

  try {
    const response = await fetch(apiResource);
    if (!response.ok) throw new Error('Failed to fetch projects');
    
    const projects = await response.json();
    
    // Clear static projects if we got real data
    if (projects.length > 0) {
      container.innerHTML = '';
      
      projects.forEach(project => {
        const article = document.createElement('article');
        article.className = 'project-card reveal fade-up';
        article.style.transitionDelay = `${project.delay || 100}ms`;
        
        let mediaContent = '';
        if (project.image) {
          mediaContent = `<img src="${project.image}" alt="${project.title}" class="project-card__img">`;
        } else if (project.pattern) {
          mediaContent = `<div class="project-card__bg ${project.pattern}"></div>`;
        } else {
          mediaContent = `<div class="project-card__bg pattern-1"></div>`;
        }

        article.innerHTML = `
          <div class="project-card__image-wrap">
            ${mediaContent}
            <div class="project-card__overlay">
              <a href="#" class="button button--icon" aria-label="View Project"><i class="ph ph-arrow-up-right"></i></a>
            </div>
          </div>
          <div class="project-card__content">
            <span class="badge">${project.category}</span>
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__text">${project.description}</p>
          </div>
        `;
        
        container.appendChild(article);
        
        // Re-observe the new element for animations
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        revealObserver.observe(article);
      });
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

/**
 * 7. Contact Form Submission
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

    const formGroups = form.querySelectorAll('.form__group');
    formGroups.forEach(group => group.classList.remove('invalid'));

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

    btnText.style.display = 'none';
    formIcon.style.display = 'none';
    spinner.style.display = 'block';
    submitBtn.disabled = true;
    feedbackEl.hidden = true;

    const apiEndpoint = form.getAttribute('data-api-endpoint');
    const method = form.getAttribute('data-method');

    const formData = {
      fullName: fullName.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        feedbackEl.textContent = result.message || "Message sent successfully!";
        feedbackEl.className = 'form__feedback success';
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      feedbackEl.textContent = "Oops! Something went wrong. Please try again later.";
      feedbackEl.className = 'form__feedback error';
      console.error('Submission error:', error);
    } finally {
      btnText.style.display = 'inline-block';
      formIcon.style.display = 'inline-block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      feedbackEl.hidden = false;

      setTimeout(() => {
        feedbackEl.hidden = true;
      }, 5000);
    }
  });
}
