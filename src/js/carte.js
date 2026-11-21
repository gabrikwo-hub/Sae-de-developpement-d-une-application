
(function () {
  const wrap = document.getElementById('france-map');
  if (!wrap) return;

  const selected  = wrap.dataset.selected;
  const available = JSON.parse(wrap.dataset.available);

  // Iterate over every department path
  wrap.querySelectorAll('path.departement').forEach(function (path) {
    const name = path.dataset.nom;
    if (!name) return;

    // Mark empty departments visually (CSS handles the grey look)
    if (!available.includes(name)) {
      path.classList.add('is-empty');
      path.setAttribute('tabindex', '-1');   // not focusable, not clickable
      path.setAttribute('aria-hidden', 'true');
      path.style.pointerEvents = 'none';      // clicks pass through, no hover state
      return;
    }

    // Highlight the currently selected department
    if (name === selected) path.classList.add('is-active');

    // Make it focusable and announced as a link
    path.setAttribute('tabindex', '0');
    path.setAttribute('role', 'link');
    path.setAttribute('aria-label', name);

    // Navigate on click
    const go = () => { window.location.search = '?departement=' + encodeURIComponent(name); };
    path.addEventListener('click', go);
    path.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  // Optional: improve perceived responsiveness on touch devices
  // by removing the 300ms tap delay (already handled by modern browsers,
  // but this ensures it on older ones).
  wrap.style.touchAction = 'manipulation';
})();