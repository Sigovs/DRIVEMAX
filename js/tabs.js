/* Accessible tabs — toggles aria-selected + panel visibility.
   Markup: [data-tabs] > [role=tab][aria-controls=panelId] + [role=tabpanel][id]. */
(function () {
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(group.querySelectorAll('[role="tabpanel"]'));

    function select(tab) {
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      var target = tab.getAttribute('aria-controls');
      panels.forEach(function (p) { p.hidden = p.id !== target; });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
        select(tabs[next]);
      });
    });
  });
})();
