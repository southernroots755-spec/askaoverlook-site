(function () {
  // Booking widget: hide the loading line once Hospitable's calendar appears,
  // or show a direct link if it hasn't appeared after a few seconds.
  document.querySelectorAll('[data-widget-slot]').forEach(function (slot) {
    var status = slot.querySelector('[data-widget-status]');
    var fallback = slot.querySelector('[data-widget-fallback]');
    var loaded = false;
    function isWidgetNode(n) {
      return n.nodeType === 1 && n.tagName !== 'SCRIPT' && n.tagName !== 'NOSCRIPT' &&
        !n.hasAttribute('data-widget-status') && !n.hasAttribute('data-widget-fallback');
    }
    function markLoaded() {
      if (loaded) return;
      loaded = true;
      if (status) status.hidden = true;
      if (fallback) fallback.hidden = true;
    }
    Array.prototype.forEach.call(slot.children, function (n) { if (isWidgetNode(n)) markLoaded(); });
    if ('MutationObserver' in window) {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (isWidgetNode(n)) markLoaded(); }); });
      }).observe(slot, { childList: true });
    }
    setTimeout(function () {
      if (loaded) return;
      if (status) status.hidden = true;
      if (fallback) fallback.hidden = false;
    }, 12000);
  });

  // Photo lightbox
  var dlg = document.getElementById('lightbox');
  if (!dlg) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-full]'));
  var img = dlg.querySelector('img');
  var cap = dlg.querySelector('[data-caption]');
  var count = dlg.querySelector('[data-count]');
  var i = 0;
  function show(n) {
    i = (n + items.length) % items.length;
    var b = items[i];
    var thumb = b.querySelector('img');
    img.src = b.getAttribute('data-full');
    img.alt = thumb.alt;
    cap.textContent = thumb.alt;
    count.textContent = (i + 1) + ' of ' + items.length;
  }
  function open(n) {
    show(n);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function close() {
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
    if (items[i]) items[i].focus();
  }
  items.forEach(function (b, n) { b.addEventListener('click', function () { open(n); }); });
  dlg.querySelector('[data-prev]').addEventListener('click', function () { show(i - 1); });
  dlg.querySelector('[data-next]').addEventListener('click', function () { show(i + 1); });
  dlg.querySelector('[data-close]').addEventListener('click', close);
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  var x0 = null;
  dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });
})();
