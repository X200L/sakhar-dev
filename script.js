(() => {
  'use strict';

  let currentLang = 'ru';

  // Safari/Private Mode и некоторые окружения могут запрещать localStorage.
  // Меню не должно из-за этого переставать работать.
  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  }

  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (_) {}
  }

  function detectLanguage() {
    const saved = safeStorageGet('sakhardev-lang');
    if (saved === 'ru' || saved === 'en') return saved;

    const browserLang = navigator.language || navigator.userLanguage || 'ru';
    const lang = browserLang.toLowerCase().startsWith('ru') ? 'ru' : 'en';
    safeStorageSet('sakhardev-lang', lang);
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
    textNodes.slice(1).forEach((node) => { node.nodeValue = ''; });
  }

  function updateLanguage(lang) {
    currentLang = lang;
    safeStorageSet('sakhardev-lang', lang);

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
    try {
      updateLanguage(detectLanguage());
      document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
          updateLanguage(currentLang === 'ru' ? 'en' : 'ru');
        });
      });
    } catch (error) {
      console.warn('Language switcher init failed:', error);
    }
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
      document.documentElement.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      menu.setAttribute('aria-hidden', String(!open));
    };

    // Начальное состояние всегда синхронизировано с DOM.
    setOpen(false);

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextState = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(nextState);
    });

    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setOpen(false);
    }, { passive: true });
  }

  function init() {
    // Меню инициализируем первым: оно не зависит от переводов или localStorage.
    try { initMobileMenu(); } catch (error) { console.error('Mobile menu init failed:', error); }
    try { initFaq(); } catch (error) { console.warn('FAQ init failed:', error); }
    initLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
