/* =========================================================
   Page « Nos actions » : JS minimal, sans jQuery ni Divi.
   Remplace : scripts.min.js, common.js, script.js (partie menu),
   jQuery + plugins. Pilote les classes de 03-header.css :
   .nav.is-open, .nav__item.is-open, .subnav__item.is-open,
   .search-panel.is-open
   ========================================================= */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const mobile = window.matchMedia('(max-width: 980px)');

  /* ---------- Menu burger (mobile / tablette) ---------- */
  const nav = $('#main-nav');
  const burger = $('.menu-toggle');

  const setMenu = (open) => {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeSubmenus();
  };

  const closeSubmenus = (except) => {
    $$('.nav__item.is-open, .subnav__item.is-open').forEach((el) => {
      if (el !== except && !el.contains(except)) el.classList.remove('is-open');
    });
  };

  if (nav && burger) {
    burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    // Repasse en desktop : on referme tout
    mobile.addEventListener('change', () => setMenu(false));
  }

  /* ---------- Sous-menus : tap sur mobile, clic sur les liens « # » ---------- */
  $$('.nav__item--has-sub > .nav__link, .subnav__item--has-sub > .subnav__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const item = link.parentElement;
      if (!mobile.matches && link.getAttribute('href') !== '#') return;
      e.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      closeSubmenus(item);
      item.classList.toggle('is-open', willOpen);
    });
  });

  /* ---------- Panneau de recherche ---------- */
  const panel = $('.search-panel');
  const input = $('#site-search');

  const setSearch = (open) => {
    if (!panel) return;
    panel.classList.toggle('is-open', open);
    if (open && input) input.focus();
  };

  $('.search-toggle')?.addEventListener('click', () => setSearch(true));
  $('.search-panel__close')?.addEventListener('click', () => setSearch(false));

  /* ---------- Échap + clic à l'extérieur ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setSearch(false);
    closeSubmenus();
    if (mobile.matches) setMenu(false);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) closeSubmenus();
  });
})();
