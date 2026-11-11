/* ============================================================
   app.js — Avvio del sito: suono, service worker, router.
   ============================================================ */
(function (App) {
  'use strict';

  /* ---- Interruttore dei suoni nell'header ---- */
  const soundButton = document.getElementById('sound-toggle');
  const soundIcon = soundButton ? soundButton.querySelector('[data-sound-icon]') : null;

  function paintSoundButton() {
    if (!soundButton || !soundIcon) return;
    const muted = App.sound.isMuted();
    soundButton.setAttribute('aria-pressed', String(!muted));
    soundButton.setAttribute('aria-label', muted ? 'Attiva i suoni' : 'Disattiva i suoni');
    soundButton.title = muted ? 'Suoni disattivati' : 'Suoni attivi';
    soundIcon.innerHTML = muted ? App.art.ui.soundOff : App.art.ui.soundOn;
  }

  if (soundButton) {
    soundButton.addEventListener('click', () => {
      const muted = App.sound.toggle();
      paintSoundButton();
      if (!muted) App.sound.pop();
      App.ui.toast(muted ? 'Suoni disattivati' : 'Suoni attivi');
    });
    paintSoundButton();
  }

  /* ---- Offline: una volta visitato, il sito resta disponibile ---- */
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((error) => {
        // Succede in locale con alcuni server o in modalità privata: non è grave.
        console.info('Service worker non registrato:', error.message);
      });
    });
  }

  /* ---- Si parte ---- */
  App.router.start();
})(window.App = window.App || {});
