/* ADEPA – script commun à toutes les pages (menu mobile, sous-menus, recherche, carrousel). */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const mobile = window.matchMedia('(max-width: 1100px)');

  /* ---------- Menu mobile & sous-menus ---------- */
  const nav = $('#main-nav');
  const toggle = $('.menu-toggle');

  const closeSubmenus = (except) => {
    $$('.nav__item.is-open, .subnav__item.is-open', nav || document).forEach((el) => {
      if (el !== except && !el.contains(except)) {
        el.classList.remove('is-open');
      }
    });
  };

  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeSubmenus();
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setMenu(!nav.classList.contains('is-open'));
    });

    mobile.addEventListener('change', () => {
      if (!mobile.matches) setMenu(false);
    });

    $$('.nav__item--has-sub > .nav__link, .subnav__item--has-sub > .subnav__link', nav).forEach((link) => {
      link.addEventListener('click', (e) => {
        const li = link.parentElement;
        if (!mobile.matches && link.getAttribute('href') !== '#') return;
        e.preventDefault();
        const willOpen = !li.classList.contains('is-open');
        closeSubmenus(li);
        li.classList.toggle('is-open', willOpen);
      });
    });
  }

  /* ---------- Panneau de recherche ---------- */
  const panel = $('.search-panel');
  const openBtn = $('.search-toggle');
  const closeBtn = $('.search-panel__close');
  const searchInput = $('.search-panel__input', panel || document);

  const setSearch = (open) => {
    if (!panel) return;
    panel.classList.toggle('is-open', open);
    if (open && searchInput) {
      searchInput.focus();
    } else if (!open && openBtn) {
      openBtn.focus();
    }
  };

  if (panel && openBtn && closeBtn) {
    openBtn.addEventListener('click', () => setSearch(true));
    closeBtn.addEventListener('click', () => setSearch(false));
  }

  /* ---------- Fermeture au clavier (Échap) et clic extérieur ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (panel?.classList.contains('is-open')) setSearch(false);
    closeSubmenus();
    if (mobile.matches) setMenu(false);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) closeSubmenus();
  });

  /* ---------- Carrousel (page d'accueil) ---------- */
  $$('.carousel').forEach((c) => {
    const track = $('.carousel__track', c);
    if (!track) return;
    const step = (dir) => {
      track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
    };
    const prev = $('.carousel__nav--prev', c);
    const next = $('.carousel__nav--next', c);
    if (prev) prev.addEventListener('click', () => step(-1));
    if (next) next.addEventListener('click', () => step(1));
  });
})();