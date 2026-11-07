/* ADEPA – interactions minimales (menu mobile, recherche, carrousel). Aucune dépendance. */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Menu mobile */
  var toggle = $('.menu-toggle'), nav = $('#main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    // Accordéon des sous-menus en mobile
    $$('.nav__item--has-sub > .nav__link, .subnav__item--has-sub > .subnav__link', nav).forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 980px)').matches) {
          var li = link.parentElement;
          if (!li.classList.contains('is-open')) { e.preventDefault(); }
          li.classList.toggle('is-open');
        }
      });
    });
  }

  /* Recherche */
  var panel = $('.search-panel'), openBtn = $('.search-toggle'), closeBtn = $('.search-panel__close');
  if (panel && openBtn && closeBtn) {
    openBtn.addEventListener('click', function () {
      panel.classList.add('is-open');
      var input = $('.search-panel__input', panel); if (input) input.focus();
    });
    closeBtn.addEventListener('click', function () { panel.classList.remove('is-open'); openBtn.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') panel.classList.remove('is-open'); });
  }

  /* Carrousel */
  $$('.carousel').forEach(function (c) {
    var track = $('.carousel__track', c);
    var step = function (dir) { track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' }); };
    var prev = $('.carousel__nav--prev', c), next = $('.carousel__nav--next', c);
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  });
})();
