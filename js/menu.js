/* Mobile drawer — toggles #mobile-menu open/closed.
   Open: [data-menu-open]. Close: [data-menu-close] (X + overlay) or Escape.
   Locks body scroll while open. No dependencies. */
(function () {
  var menu = document.getElementById('mobile-menu');
  if (!menu) return;
  var openBtn = document.querySelector('[data-menu-open]');

  function open() {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
  }

  if (openBtn) openBtn.addEventListener('click', open);
  menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });
  // close when a nav link is tapped
  menu.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
})();
