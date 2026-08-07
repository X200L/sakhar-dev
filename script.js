(() => {
  'use strict';

  // Language management
  let currentLang = 'ru';

  // Auto-detect language on first visit
  function detectLanguage() {
    const savedLang = localStorage.getItem('sakhardev-lang');
    if (savedLang) {
      return savedLang;
    }

    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.startsWith('ru') ? 'ru' : 'en';
    localStorage.setItem('sakhardev-lang', lang);
    return lang;
  }

  // Update all translatable elements
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sakhardev-lang', lang);

    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.querySelector('.lang-active').textContent = lang.toUpperCase();
    }

    // Update all elements with data-ru and data-en attributes
    document.querySelectorAll('[data-ru][data-en]').forEach(element => {
      const text = element.getAttribute(`data-${lang}`);
      if (text) {
        // Check if it's an input/textarea
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = text;
        } else if (element.classList.contains('faq-answer-text')) {
          // Use innerHTML for FAQ answers to preserve links
          element.innerHTML = text;
        } else {
          element.textContent = text;
        }
      }
    });

    // Update document language
    document.documentElement.lang = lang;
  }

  // Toggle language
  function toggleLanguage() {
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    updateLanguage(newLang);
  }

  // Initialize language on page load
  function initLanguage() {
    const lang = detectLanguage();
    updateLanguage(lang);

    // Add click handler to language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', toggleLanguage);
    }
  }

  // FAQ accordion: only one question is open at a time
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-button');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    button.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const otherButton = other.querySelector('.faq-button');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
      });

      if (willOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Close an opened FAQ with Escape for keyboard users
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openItem = document.querySelector('.faq-item.is-open');
    if (!openItem) return;
    openItem.classList.remove('is-open');
    const button = openItem.querySelector('.faq-button');
    const answer = openItem.querySelector('.faq-answer');
    if (button) button.setAttribute('aria-expanded', 'false');
    if (answer) answer.setAttribute('aria-hidden', 'true');
  });

  // Mobile menu toggle
  function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileMenuToggle || !navMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLanguage();
      initMobileMenu();
    });
  } else {
    initLanguage();
    initMobileMenu();
  }
})();
