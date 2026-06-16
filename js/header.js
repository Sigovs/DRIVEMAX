/* Transparent header that gains a solid background colour on scroll.
   Toggles .is-scrolled on #hdr past a small threshold. */
(function () {
  var h = document.getElementById('hdr');
  if (!h) return;
  var onScroll = function () {
    h.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
