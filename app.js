// Fade in on page load
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('visible');
  });
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
