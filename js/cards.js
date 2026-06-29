/* Inventory-card quick actions — Save + Send to phone.
   Cards are <a> links, so these buttons preventDefault/stopPropagation
   to avoid triggering card navigation. Event-delegated, so it also
   covers cards rendered dynamically on the SRP. No dependencies. */
(function () {
  'use strict';

  function flash(btn, text, ms) {
    var label = btn.querySelector('[data-label]');
    if (!label || btn._busy) return;
    btn._busy = true;
    var original = label.textContent;
    label.textContent = text;
    btn.classList.add('is-done');
    setTimeout(function () {
      label.textContent = original;
      btn.classList.remove('is-done');
      btn._busy = false;
    }, ms || 1600);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-card-action]') : null;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    var action = btn.getAttribute('data-card-action');

    if (action === 'save') {
      var saved = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!saved));
      var label = btn.querySelector('[data-label]');
      if (label) label.textContent = saved ? 'Save' : 'Saved';
    } else if (action === 'send') {
      // design-only stub: confirm the link was "texted" to the shopper
      flash(btn, 'Link sent', 1600);
    } else if (action === 'share') {
      var url = window.location.href;
      var title = document.title;
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { flash(btn, 'Link copied', 1600); }).catch(function () {});
      } else {
        flash(btn, 'Link copied', 1600);
      }
    }
  });
})();
