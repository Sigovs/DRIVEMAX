/* VDP gallery — thumbnails, prev/next arrows, fullscreen lightbox.
   Thumbnails carry data-thumb="src". Arrows + lightbox share the same
   current index. Keyboard: ←/→ navigate, Esc closes. No deps. */
(function () {
  'use strict';

  var main   = document.getElementById('gallery-main');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-thumb]'));
  if (!main || !thumbs.length) return;

  var srcs = thumbs.map(function (t) { return t.getAttribute('data-thumb'); });
  var total = srcs.length;
  var idx = 0;

  var idxLabel  = document.getElementById('gallery-index');
  var lb        = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightbox-img');
  var lbIdx     = document.getElementById('lightbox-index');

  function render() {
    var src = srcs[idx];
    main.src = src;
    if (lbImg) lbImg.src = src;
    if (idxLabel) idxLabel.textContent = idx + 1;
    if (lbIdx) lbIdx.textContent = idx + 1;
    thumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === idx); });
  }
  function go(n) { idx = (n + total) % total; render(); }

  // thumbnails
  thumbs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });

  // arrows (present both on the main image and inside the lightbox)
  document.querySelectorAll('[data-gallery-prev]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); go(idx - 1); });
  });
  document.querySelectorAll('[data-gallery-next]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); go(idx + 1); });
  });

  // fullscreen lightbox
  function openLB() { if (!lb) return; lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeLB() { if (!lb) return; lb.classList.remove('is-open'); document.body.style.overflow = ''; }
  document.querySelectorAll('[data-gallery-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openLB(); });
  });
  document.querySelectorAll('[data-gallery-close]').forEach(function (b) {
    b.addEventListener('click', closeLB);
  });
  // click on backdrop (not the image/arrows) closes
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });

  // keyboard
  document.addEventListener('keydown', function (e) {
    if (lb && lb.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'ArrowRight') go(idx + 1);
    }
  });

  render();

  /* ---- Payment calculator ---- */
  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var priceEl = document.getElementById('calc-price');
    var downEl  = document.getElementById('calc-down');
    var termEl  = document.getElementById('calc-term');
    var aprEl   = document.getElementById('calc-apr');
    var out     = calc.querySelector('[data-calc-result]');
    var num = function (el) { var n = parseFloat((el.value || '').replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };

    function recalc() {
      var principal = Math.max(0, num(priceEl) - num(downEl));
      var n = parseInt(termEl.value, 10) || 1;
      var r = num(aprEl) / 100 / 12;
      var pay = r > 0 ? (principal * r) / (1 - Math.pow(1 + r, -n)) : principal / n;
      if (!isFinite(pay) || pay < 0) pay = 0;
      out.textContent = '$' + Math.round(pay).toLocaleString('en-US');
    }
    [priceEl, downEl, aprEl].forEach(function (el) { el.addEventListener('input', recalc); });
    termEl.addEventListener('change', recalc);
    recalc();
  }
})();
