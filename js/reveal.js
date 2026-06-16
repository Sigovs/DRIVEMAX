/* Tiny scroll-reveal — adds .is-in to [data-reveal] when it enters view.
   No dependencies. Respects prefers-reduced-motion. */
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        var delay = el.getAttribute('data-reveal-delay') || 0;
        el.style.transitionDelay = delay + 's';
        el.classList.add('is-in');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  els.forEach(function (el) { io.observe(el); });
})();
