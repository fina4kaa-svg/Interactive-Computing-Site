// Fade in on page load
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
  });
});

// Work card iframe preview (lazy-loaded on first hover)
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (!card.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      iframe.src = card.getAttribute('href');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('tabindex', '-1');
      card.appendChild(iframe);
    }
  }, { once: false });
});

// Fade out before navigating away (links with data-transition attribute)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-transition]');
  if (!link) return;

  e.preventDefault();
  const href = link.getAttribute('href');

  document.body.classList.remove('visible');

  setTimeout(() => {
    window.location.href = href;
  }, 450);
});
