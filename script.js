(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var header = document.querySelector('.site-header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');

  // Mobile menu
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1024) setMenu(false); });

  // Header state + to-top
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Accordions
  function toggle(item, open) {
    var btn = item.querySelector('.acc-btn');
    var panel = item.querySelector('.acc-panel');
    if (open) { panel.hidden = false; requestAnimationFrame(function () { item.classList.add('open'); }); }
    else {
      item.classList.remove('open');
      setTimeout(function () { if (!item.classList.contains('open')) panel.hidden = true; }, 350);
    }
    btn.setAttribute('aria-expanded', String(open));
  }
  document.querySelectorAll('[data-accordion]').forEach(function (acc, ai) {
    acc.querySelectorAll('.acc-item').forEach(function (item, i) {
      var btn = item.querySelector('.acc-btn');
      var panel = item.querySelector('.acc-panel');
      var id = 'acc-' + ai + '-' + i;
      panel.id = id; btn.setAttribute('aria-controls', id);
      btn.addEventListener('click', function () { toggle(item, btn.getAttribute('aria-expanded') !== 'true'); });
    });
  });
  document.querySelectorAll('[data-expand]').forEach(function (b) {
    b.addEventListener('click', function () {
      var acc = b.closest('.container').querySelector('[data-accordion]');
      var items = acc.querySelectorAll('.acc-item');
      var allOpen = Array.prototype.every.call(items, function (it) { return it.classList.contains('open'); });
      items.forEach(function (it) { toggle(it, !allOpen); });
      b.textContent = allOpen ? 'Развернуть все главы' : 'Свернуть все главы';
    });
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('in'); }); }

  // Active nav link
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) so.observe(s); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
