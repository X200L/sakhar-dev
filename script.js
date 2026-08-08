(() => {
  'use strict';

  let currentLang = 'ru';

  function detectLanguage() {
    const saved = localStorage.getItem('sakhardev-lang');
    if (saved === 'ru' || saved === 'en') return saved;

    const browserLang = navigator.language || navigator.userLanguage || 'ru';
    const lang = browserLang.toLowerCase().startsWith('ru') ? 'ru' : 'en';
    localStorage.setItem('sakhardev-lang', lang);
    return lang;
  }

  // Меняем только текстовые узлы элемента и не удаляем вложенные SVG/иконки/маркеры.
  function setTranslatedText(element, text) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = text;
      return;
    }

    if (element.classList.contains('faq-answer-text')) {
      element.innerHTML = text;
      return;
    }

    const textNodes = [...element.childNodes].filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0
    );

    if (!textNodes.length) {
      element.textContent = text;
      return;
    }

    const original = textNodes[0].nodeValue;
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    textNodes[0].nodeValue = `${leading}${text}${trailing}`;
    textNodes.slice(1).forEach((node) => {
      node.nodeValue = '';
    });
  }

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sakhardev-lang', lang);

    document.querySelectorAll('[data-lang-toggle] .lang-active').forEach((label) => {
      label.textContent = lang.toUpperCase();
    });

    document.querySelectorAll('[data-ru][data-en]').forEach((element) => {
      const text = element.getAttribute(`data-${lang}`);
      if (text) setTranslatedText(element, text);
    });

    document.documentElement.lang = lang;
  }

  function initLanguage() {
    updateLanguage(detectLanguage());
    document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        updateLanguage(currentLang === 'ru' ? 'en' : 'ru');
      });
    });
  }

  function initFaq() {
    const faqItems = [...document.querySelectorAll('.faq-item')];

    faqItems.forEach((item) => {
      const button = item.querySelector('.faq-button');
      const answer = item.querySelector('.faq-answer');
      if (!button || !answer) return;

      button.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');

        faqItems.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.faq-button')?.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'true');
        });

        if (willOpen) {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.classList.toggle('active', open);
      menu.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(!menu.classList.contains('active'));
    });

    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  function init() {
    initLanguage();
    initFaq();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
