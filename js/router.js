/* ============================================================
   router.js — Un router piccolissimo basato sull'hash.
   Ogni pagina si registra con { title, section, mount }.
   Il router si occupa di: pulizia, focus, titolo e voce di menu.
   ============================================================ */
(function (App) {
  'use strict';

  const views = new Map();
  let activeController = null;
  let activeCleanup = null;
  let timeouts = new Set();
  let intervals = new Set();
  let firstRender = true;

  /** Registra una pagina: id, titolo, sezione del menu e funzione di mount. */
  function register(id, definition) {
    views.set(id, definition);
  }

  function currentId() {
    return (window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'home');
  }

  function go(id) {
    window.location.hash = `#/${id}`;
  }

  /** Evidenzia la voce di menu giusta, anche per le pagine degli strumenti. */
  function updateNav(id, section) {
    App.dom.$$('[data-nav]').forEach((link) => {
      const target = link.dataset.nav;
      const isActive = target === section || target === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function clearTimers() {
    timeouts.forEach((id) => window.clearTimeout(id));
    intervals.forEach((id) => window.clearInterval(id));
    timeouts = new Set();
    intervals = new Set();
  }

  /** Il contesto passato a ogni pagina: timer e listener si puliscono da soli. */
  function createContext(id, controller) {
    const timeout = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timeouts.delete(timer);
        if (!controller.signal.aborted) callback();
      }, delay);
      timeouts.add(timer);
      return timer;
    };

    const interval = (callback, delay) => {
      const timer = window.setInterval(() => {
        if (!controller.signal.aborted) callback();
      }, delay);
      intervals.add(timer);
      return timer;
    };

    const on = (target, type, handler, options) => {
      const settings = typeof options === 'object' && options !== null
        ? { ...options, signal: controller.signal }
        : { capture: Boolean(options), signal: controller.signal };
      target.addEventListener(type, handler, settings);
    };

    return { id, signal: controller.signal, timeout, interval, on, go };
  }

  function fallback(container) {
    container.append(
      App.ui.page({
        kicker: 'Ops, pagina smarrita',
        title: 'Questa pagina è volata via con un pipistrello',
        lead: 'Forse il link è vecchio, oppure c’è un refuso. Torniamo insieme al quaderno?',
        back: { href: '', label: 'Torna alla home' }
      })
    );
  }

  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    const id = currentId();
    const definition = views.get(id);

    if (activeCleanup) {
      try {
        activeCleanup();
      } catch (error) {
        console.error('Errore nella pulizia della pagina:', error);
      }
      activeCleanup = null;
    }
    if (activeController) activeController.abort();
    clearTimers();

    const controller = new AbortController();
    activeController = controller;
    const context = createContext(id, controller);

    const container = document.createElement('div');
    container.className = 'view';
    app.replaceChildren(container);

    if (definition) {
      document.title = definition.title
        ? `${definition.title} · Il quaderno di Lucrezia`
        : 'Il quaderno di Lucrezia';
      document.body.dataset.view = definition.section || id;
      updateNav(id, definition.section);
      try {
        const result = definition.mount(container, context);
        activeCleanup = typeof result === 'function' ? result : null;
      } catch (error) {
        console.error(`Errore nel caricamento di "${id}":`, error);
        container.replaceChildren();
        fallback(container);
      }
    } else {
      document.title = 'Pagina non trovata · Il quaderno di Lucrezia';
      document.body.dataset.view = 'notfound';
      updateNav(id, 'notfound');
      fallback(container);
    }

    // Il focus va al contenuto, così chi usa la tastiera riparte da qui.
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: firstRender || App.util.reducedMotion() ? 'auto' : 'smooth' });
    firstRender = false;
  }

  function start() {
    window.addEventListener('hashchange', render);
    render();
  }

  App.router = { register, go, start, render, currentId };
})(window.App = window.App || {});
