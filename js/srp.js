/* SRP — Search Results Page.
   Renders inventory cards from data, filters + sorts client-side.
   No dependencies. Filters: keyword, year (min/max), make, model,
   price (dual range), mileage (dual range), body, drivetrain, certified. */
(function () {
  'use strict';

  /* ---- Inventory (same vehicles as the home page featured carousel) ---- */
  var INVENTORY = [
    { year: 2018, make: 'BMW',           model: 'X5',           trim: 'xDrive50i',        price: 22998, payment: 358,  miles: 76412, body: 'SUV',   trans: 'Automatic', drivetrain: 'AWD', engine: 'Twin-Turbo V8', certified: false, badge: { label: 'Luxury',      variant: 'blue' },    img: 'images/vehicles/photos/x5/x5-01.jpg' },
    { year: 2022, make: 'Ford',          model: 'Explorer',     trim: 'XLT 4WD',          price: 31995, payment: 489,  miles: 28410, body: 'SUV',   trans: 'Automatic', drivetrain: '4WD', engine: 'V6',            certified: true,  badge: { label: 'Certified',   variant: 'success' }, img: 'images/vehicles/photos/explorer.jpg' },
    { year: 2023, make: 'Toyota',        model: 'Camry',        trim: 'SE',               price: 26480, payment: 399,  miles: 19802, body: 'Sedan', trans: 'Automatic', drivetrain: 'FWD', engine: '4-Cyl',         certified: false, badge: { label: 'Price drop',  variant: 'warning' }, img: 'images/vehicles/photos/camry.jpg' },
    { year: 2021, make: 'Mercedes-Benz', model: 'C 300',        trim: '4MATIC',           price: 33750, payment: 515,  miles: 34150, body: 'Sedan', trans: 'Automatic', drivetrain: 'AWD', engine: 'Turbo I4',      certified: false, badge: { label: 'Luxury',      variant: 'blue' },    img: 'images/vehicles/photos/c300.jpg' },
    { year: 2021, make: 'Volvo',         model: 'XC60',         trim: 'Momentum',         price: 29900, payment: 455,  miles: 31240, body: 'SUV',   trans: 'Automatic', drivetrain: 'AWD', engine: 'Turbo I4',      certified: true,  badge: { label: 'Certified',   variant: 'success' }, img: 'images/vehicles/photos/volvo-xc60.jpg', pos: 'center 68%' },
    { year: 2020, make: 'BMW',           model: 'M3',           trim: 'Sedan',            price: 44800, payment: 679,  miles: 27500, body: 'Sedan', trans: 'Automatic', drivetrain: 'RWD', engine: 'Twin-Turbo I6', certified: false, badge: { label: 'Performance', variant: 'blue' },    img: 'images/vehicles/photos/bmw-m3.jpg', pos: 'center 70%' },
    { year: 2022, make: 'Ford',          model: 'F-250',        trim: 'Super Duty XLT',   price: 48250, payment: 735,  miles: 22980, body: 'Truck', trans: 'Automatic', drivetrain: '4WD', engine: 'V8',            certified: false, badge: { label: '4x4',         variant: 'neutral' }, img: 'images/vehicles/photos/ford-f250.jpg', pos: 'center 70%' },
    { year: 2023, make: 'Maserati',      model: 'GranTurismo',  trim: '',                 price: 89500, payment: 1299, miles: 8120,  body: 'Coupe', trans: 'Automatic', drivetrain: 'AWD', engine: 'V6 Twin-Turbo', certified: false, badge: { label: 'Luxury',      variant: 'blue' },    img: 'images/vehicles/photos/blue-coupe.jpg', pos: 'center 66%' },
    { year: 2021, make: 'Jeep',          model: 'Grand Cherokee', trim: 'Laredo',         price: 30640, payment: 469,  miles: 36700, body: 'SUV',   trans: 'Automatic', drivetrain: '4WD', engine: 'V6',            certified: true,  badge: { label: 'Certified',   variant: 'success' }, img: 'images/vehicles/photos/grand-cherokee.jpg' },
    { year: 2022, make: 'Lexus',         model: 'ES 350',       trim: '',                 price: 35900, payment: 549,  miles: 24300, body: 'Sedan', trans: 'Automatic', drivetrain: 'FWD', engine: 'V6',            certified: false, badge: { label: 'Luxury',      variant: 'blue' },    img: 'images/vehicles/photos/lexus-es.jpg' },
    { year: 2022, make: 'Audi',          model: 'Q5',           trim: 'Premium',          price: 37400, payment: 569,  miles: 26150, body: 'SUV',   trans: 'Automatic', drivetrain: 'AWD', engine: 'Turbo I4',      certified: true,  badge: { label: 'Certified',   variant: 'success' }, img: 'images/vehicles/photos/audi-q5.jpg' }
  ];

  /* ---- Helpers ---- */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toLocaleString('en-US'); };
  var moneyShort = function (n) { return n >= 1000 ? '$' + (n / 1000) + 'k' : '$' + n; };
  var milesShort = function (n) { return n >= 1000 ? (n / 1000) + 'k' : '' + n; };

  /* ---- DOM refs ---- */
  var resultsEl = $('[data-results]');
  var emptyEl   = $('[data-empty]');
  var chipsEl   = $('[data-active-chips]');
  var countEls  = $$('[data-result-count]');
  var countInline = $$('[data-result-count-inline]');
  var f = {
    kw:      $('#f-kw'),
    make:    $('#f-make'),
    model:   $('#f-model'),
    trim:    $('#f-trim'),
    certified: $('#f-certified'),
    sort:    $('#f-sort')
  };

  /* ---- Populate make select ---- */
  var makes = INVENTORY.map(function (v) { return v.make; })
    .filter(function (m, i, a) { return a.indexOf(m) === i; }).sort();
  makes.forEach(function (m) {
    f.make.insertAdjacentHTML('beforeend', '<option value="' + m + '">' + m + '</option>');
  });

  /* ---- Make → Model dependency ---- */
  function refreshModels() {
    var make = f.make.value;
    f.model.innerHTML = '<option value="">Any model</option>';
    if (!make) { f.model.disabled = true; return; }
    var models = INVENTORY.filter(function (v) { return v.make === make; })
      .map(function (v) { return v.model; })
      .filter(function (m, i, a) { return a.indexOf(m) === i; }).sort();
    models.forEach(function (m) {
      f.model.insertAdjacentHTML('beforeend', '<option value="' + m + '">' + m + '</option>');
    });
    f.model.disabled = false;
  }

  /* ---- Make + Model → Trim dependency ---- */
  function refreshTrims() {
    f.trim.innerHTML = '<option value="">Any trim</option>';
    var make = f.make.value, model = f.model.value;
    var trims = (make && model) ? INVENTORY
      .filter(function (v) { return v.make === make && v.model === model && v.trim; })
      .map(function (v) { return v.trim; })
      .filter(function (t, i, a) { return a.indexOf(t) === i; }).sort() : [];
    if (!trims.length) { f.trim.disabled = true; return; }
    trims.forEach(function (t) {
      f.trim.insertAdjacentHTML('beforeend', '<option value="' + t + '">' + t + '</option>');
    });
    f.trim.disabled = false;
  }

  /* ---- Dual-range sliders ---- */
  var ranges = {}; // key -> { min, max, lo, hi }
  $$('[data-range]').forEach(function (el) {
    var key = el.getAttribute('data-range');
    var lo = el.querySelector('.range__min');
    var hi = el.querySelector('.range__max');
    var fill = el.querySelector('.range__fill');
    var fmt = el.getAttribute('data-format');
    var min = +el.getAttribute('data-min'), max = +el.getAttribute('data-max');
    var loLabel = $('[data-range-min-label="' + key + '"]');
    var hiLabel = $('[data-range-max-label="' + key + '"]');
    ranges[key] = { min: min, max: max, lo: min, hi: max };

    function fmtVal(n, isMax) {
      if (fmt === 'money') return moneyShort(n) + (isMax && n >= max ? '+' : '');
      if (fmt === 'miles') return milesShort(n) + (isMax && n >= max ? '+' : '');
      return '' + n;
    }
    function paint() {
      var a = +lo.value, b = +hi.value;
      if (a > b - (+lo.step)) { // keep a small gap, swap if crossed
        if (this === lo) { a = b; lo.value = a; } else { b = a; hi.value = b; }
      }
      var pa = ((a - min) / (max - min)) * 100;
      var pb = ((b - min) / (max - min)) * 100;
      fill.style.left = pa + '%';
      fill.style.right = (100 - pb) + '%';
      if (loLabel) loLabel.textContent = fmtVal(a, false);
      if (hiLabel) hiLabel.textContent = fmtVal(b, true);
      ranges[key].lo = a; ranges[key].hi = b;
    }
    lo.addEventListener('input', function () { paint.call(lo); apply(); });
    hi.addEventListener('input', function () { paint.call(hi); apply(); });
    el._reset = function () { lo.value = min; hi.value = max; paint.call(lo); };
    paint();
  });

  /* ---- Read current filter state ---- */
  function readGroup(name) {
    return $$('[data-filter-group="' + name + '"] input:checked').map(function (i) { return i.value; });
  }
  function getState() {
    return {
      kw: (f.kw.value || '').trim().toLowerCase(),
      yearLo: ranges.year.lo, yearHi: ranges.year.hi,
      make: f.make.value,
      model: f.model.value,
      trim: f.trim.value,
      priceLo: ranges.price.lo, priceHi: ranges.price.hi,
      milesLo: ranges.miles.lo, milesHi: ranges.miles.hi,
      body: readGroup('body'),
      drivetrain: readGroup('drivetrain'),
      certified: f.certified.checked
    };
  }

  /* ---- Filter + sort ---- */
  function matches(v, s) {
    if (s.kw) {
      var hay = (v.year + ' ' + v.make + ' ' + v.model + ' ' + v.trim + ' ' + v.body + ' ' + v.drivetrain + ' ' + v.engine).toLowerCase();
      if (hay.indexOf(s.kw) === -1) return false;
    }
    if (v.year < s.yearLo || v.year > s.yearHi) return false;
    if (s.make && v.make !== s.make) return false;
    if (s.model && v.model !== s.model) return false;
    if (s.trim && v.trim !== s.trim) return false;
    if (v.price < s.priceLo || (s.priceHi < ranges.price.max && v.price > s.priceHi)) return false;
    if (v.miles < s.milesLo || (s.milesHi < ranges.miles.max && v.miles > s.milesHi)) return false;
    if (s.body.length && s.body.indexOf(v.body) === -1) return false;
    if (s.drivetrain.length && s.drivetrain.indexOf(v.drivetrain) === -1) return false;
    if (s.certified && !v.certified) return false;
    return true;
  }
  function sortList(list, mode) {
    var c = list.slice();
    if (mode === 'price-asc')  c.sort(function (a, b) { return a.price - b.price; });
    else if (mode === 'price-desc') c.sort(function (a, b) { return b.price - a.price; });
    else if (mode === 'year-desc')  c.sort(function (a, b) { return b.year - a.year; });
    else if (mode === 'miles-asc')  c.sort(function (a, b) { return a.miles - b.miles; });
    return c;
  }

  /* ---- Card markup (mirrors home-page card component) ---- */
  function cardHTML(v) {
    var name = (v.model + ' ' + v.trim).trim();
    var pos = v.pos ? ' style="object-position:' + v.pos + '"' : '';
    return '' +
    '<a href="vdp.html" class="card group flex flex-col hover:shadow-lg hover:-translate-y-1 transition">' +
      '<div class="card__media relative overflow-hidden">' +
        '<img src="' + v.img + '" alt="' + v.year + ' ' + v.make + ' ' + name + '" class="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"' + pos + ' loading="lazy" />' +
        '<span class="badge badge--' + v.badge.variant + ' absolute top-3 left-3">' + v.badge.label + '</span>' +
        '<span class="badge badge--neutral absolute top-3 right-3 font-mono">' + v.miles.toLocaleString('en-US') + ' mi</span>' +
      '</div>' +
      '<div class="card__body flex flex-col flex-1">' +
        '<h3 class="t-h4 group-hover:text-blue transition-colors">' + v.year + ' ' + v.make + ' ' + name + '</h3>' +
        '<div class="flex flex-wrap gap-x-3 gap-y-1 mt-3 t-caption text-muted"><span>' + v.trans + '</span><span>·</span><span>' + v.drivetrain + '</span><span>·</span><span>' + v.engine + '</span></div>' +
        '<div class="flex items-end justify-between gap-3 mt-auto pt-5 border-t border-border">' +
          '<div><div class="t-price">' + money(v.price) + '</div></div>' +
          '<span class="t-button text-blue inline-flex items-center gap-1">View<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>' +
        '</div>' +
        '<div class="flex items-center gap-2 mt-3">' +
          '<button type="button" data-card-action="save" aria-pressed="false" aria-label="Save this vehicle" class="btn btn--outline btn--sm">' +
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>' +
            '<span data-label>Save</span>' +
          '</button>' +
          '<button type="button" data-card-action="send" aria-label="Send to phone" class="btn btn--outline btn--sm">' +
            '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>' +
            '<span data-label>Send to phone</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  /* ---- Active filter chips ---- */
  function chip(label, onRemove) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'badge badge--blue';
    b.style.cursor = 'pointer';
    b.innerHTML = label + ' <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
    b.addEventListener('click', onRemove);
    return b;
  }
  function renderChips(s) {
    chipsEl.innerHTML = '';
    if (s.kw) chipsEl.appendChild(chip('“' + f.kw.value.trim() + '”', function () { f.kw.value = ''; apply(); }));
    if (s.yearLo > ranges.year.min || s.yearHi < ranges.year.max) chipsEl.appendChild(chip(s.yearLo + '–' + s.yearHi, function () { $('[data-range="year"]')._reset(); apply(); }));
    if (s.make) chipsEl.appendChild(chip(s.make, function () { f.make.value = ''; refreshModels(); refreshTrims(); apply(); }));
    if (s.model) chipsEl.appendChild(chip(s.model, function () { f.model.value = ''; refreshTrims(); apply(); }));
    if (s.trim) chipsEl.appendChild(chip(s.trim, function () { f.trim.value = ''; apply(); }));
    if (s.priceLo > ranges.price.min || s.priceHi < ranges.price.max) chipsEl.appendChild(chip(moneyShort(s.priceLo) + '–' + moneyShort(s.priceHi), function () { $('[data-range="price"]')._reset(); apply(); }));
    if (s.milesLo > ranges.miles.min || s.milesHi < ranges.miles.max) chipsEl.appendChild(chip('≤ ' + milesShort(s.milesHi) + ' mi', function () { $('[data-range="miles"]')._reset(); apply(); }));
    s.body.forEach(function (val) { chipsEl.appendChild(chip(val, function () { uncheck('body', val); apply(); })); });
    s.drivetrain.forEach(function (val) { chipsEl.appendChild(chip(val, function () { uncheck('drivetrain', val); apply(); })); });
    if (s.certified) chipsEl.appendChild(chip('Certified', function () { f.certified.checked = false; apply(); }));
    // visible "Clear all" whenever any filter is active
    if (chipsEl.children.length) {
      var clr = document.createElement('button');
      clr.type = 'button';
      clr.className = 'btn btn--link t-body-sm ml-1';
      clr.textContent = 'Clear all';
      clr.addEventListener('click', clearAll);
      chipsEl.appendChild(clr);
    }
  }
  function uncheck(group, val) {
    var input = $('[data-filter-group="' + group + '"] input[value="' + val + '"]');
    if (input) input.checked = false;
  }

  /* ---- Apply (filter → sort → render) ---- */
  function apply() {
    var s = getState();
    var list = sortList(INVENTORY.filter(function (v) { return matches(v, s); }), f.sort.value);
    resultsEl.innerHTML = list.map(cardHTML).join('');
    emptyEl.classList.toggle('hidden', list.length !== 0);
    countEls.forEach(function (el) { el.textContent = list.length; });
    countInline.forEach(function (el) { el.textContent = list.length; });
    renderChips(s);

    // badge: number of active *advanced* filters (those inside the All-filters panel)
    var advBadge = $('[data-advanced-count]');
    if (advBadge) {
      var adv = s.body.length + s.drivetrain.length + (s.certified ? 1 : 0) +
        ((s.milesLo > ranges.miles.min || s.milesHi < ranges.miles.max) ? 1 : 0);
      advBadge.textContent = adv ? String(adv) : '';
    }
  }

  /* ---- Clear all ---- */
  function clearAll() {
    f.kw.value = '';
    f.make.value = ''; refreshModels(); refreshTrims();
    f.certified.checked = false;
    $$('[data-filter-group] input:checked').forEach(function (i) { i.checked = false; });
    $$('[data-range]').forEach(function (el) { el._reset(); });
    apply();
  }

  /* ---- Wire up events ---- */
  f.kw.addEventListener('input', apply);
  f.make.addEventListener('change', function () { refreshModels(); refreshTrims(); apply(); });
  f.model.addEventListener('change', function () { refreshTrims(); apply(); });
  [f.trim, f.certified, f.sort].forEach(function (el) { el.addEventListener('change', apply); });
  $$('[data-filter-group] input').forEach(function (i) { i.addEventListener('change', apply); });
  $$('[data-clear-filters]').forEach(function (b) { b.addEventListener('click', clearAll); });

  /* ---- "All filters" advanced panel toggle ---- */
  var advToggle = $('[data-advanced-toggle]');
  var advPanel  = $('[data-advanced]');
  if (advToggle && advPanel) {
    advToggle.addEventListener('click', function () {
      var open = advPanel.hidden;
      advPanel.hidden = !open;
      advToggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---- Initial render ---- */
  apply();
})();
