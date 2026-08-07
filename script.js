(() => {
  'use strict';

  // FAQ accordion: only one question is open at a time, matching the React version.
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

  // Close an opened FAQ with Escape for keyboard users.
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
})();
