(function () {
  // ← ADD THIS BLOCK: Restore scroll position on page load
  const savedScroll = sessionStorage.getItem('mapScroll');
  if (savedScroll !== null) {
    window.scrollTo(0, parseInt(savedScroll, 10));
    sessionStorage.removeItem('mapScroll');
  }

  const wrap = document.getElementById('france-map');
  if (!wrap) return;

  const selected = wrap.dataset.selected;
  const available = JSON.parse(wrap.dataset.available);

  // Iterate over every department path
  wrap.querySelectorAll('path.departement').forEach(function (path) {
    const name = path.dataset.nom;
    if (!name) return;

    // Mark empty departments visually (CSS handles the grey look)
    if (!available.includes(name)) {
      path.classList.add('is-empty');
      path.setAttribute('tabindex', '-1');
      path.setAttribute('aria-hidden', 'true');
      path.style.pointerEvents = 'none';
      return;
    }

    // Highlight the currently selected department
    if (name === selected) path.classList.add('is-active');

    // Make it focusable and announced as a link
    path.setAttribute('tabindex', '0');
    path.setAttribute('role', 'link');
    path.setAttribute('aria-label', name);

    // Navigate on click
    const go = () => {
      sessionStorage.setItem('mapScroll', String(window.scrollY));
      window.location.search = '?departement=' + encodeURIComponent(name);
    };
    path.addEventListener('click', go);
    path.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  wrap.style.touchAction = 'manipulation';
})();