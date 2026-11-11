/* ============================================================
   timer.js — Timer di classe con quadrante circolare.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;
  const { clamp, clock } = App.util;

  const MIN_MINUTES = 1;
  const MAX_MINUTES = 60;
  const RING_RADIUS = 136;
  const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

  function dialSvg() {
    const ticks = Array.from({ length: 12 }, (_, index) => {
      const angle = index * 30;
      return `<line x1="160" y1="12" x2="160" y2="22" transform="rotate(${angle} 160 160)" />`;
    }).join('');

    return `
      <svg viewBox="0 0 320 320" aria-hidden="true" focusable="false">
        <circle cx="160" cy="160" r="148" fill="var(--paper-2)" opacity=".35"/>
        <circle cx="160" cy="160" r="136" fill="none" stroke="var(--paper-2)" stroke-width="18"/>
        <circle class="timer-ring" cx="160" cy="160" r="${RING_RADIUS}" fill="none"
          stroke="var(--marigold)" stroke-width="18" stroke-linecap="round"
          transform="rotate(-90 160 160)"
          stroke-dasharray="${RING_LENGTH.toFixed(2)}" stroke-dashoffset="0"/>
        <circle cx="160" cy="160" r="112" fill="none" stroke="var(--ink)"
          stroke-width="1.5" stroke-dasharray="3 9" opacity=".28"/>
        <g stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round" opacity=".35">${ticks}</g>
        <g fill="var(--coral)" opacity=".85">
          <path d="M54 64c.6 4.6 2.6 6.6 7.2 7.2-4.6.6-6.6 2.6-7.2 7.2-.6-4.6-2.6-6.6-7.2-7.2 4.6-.6 6.6-2.6 7.2-7.2Z"/>
          <path d="M264 246c.5 3.8 2.2 5.5 6 6-3.8.5-5.5 2.2-6 6-.5-3.8-2.2-5.5-6-6 3.8-.5 5.5-2.2 6-6Z"/>
        </g>
      </svg>`;
  }

  App.router.register('timer', {
    title: 'Timer di classe',
    section: 'strumenti',
    mount(root, ctx) {
      const saved = clamp(Number(App.store.get('timer.minutes', 5)) || 5, MIN_MINUTES, MAX_MINUTES);

      let minutes = saved;
      let total = minutes * 60;
      let remaining = total;
      let running = false;
      let done = false;
      let endAt = 0;

      const readout = el('strong', { text: clock(remaining) });
      const readoutLabel = el('span', { text: 'rimasti' });
      const dial = el('div', { class: 'timer-dial', html: dialSvg() }, [
        el('div', { class: 'timer-readout' }, [readout, readoutLabel])
      ]);
      const ring = dial.querySelector('.timer-ring');

      const presetValues = [1, 3, 5, 10, 15, 30];
      const presetButtons = presetValues.map((value) =>
        el('button', {
          class: 'chip',
          type: 'button',
          'aria-pressed': 'false',
          dataset: { minutes: String(value) },
          text: `${value} min`,
          on: { click: () => setMinutes(value) }
        })
      );

      const customInput = el('input', {
        class: 'input',
        type: 'number',
        min: String(MIN_MINUTES),
        max: String(MAX_MINUTES),
        step: '1',
        value: String(minutes),
        inputmode: 'numeric',
        'aria-label': 'Minuti da impostare'
      });
      customInput.addEventListener('change', () => setMinutes(Number(customInput.value)));

      const startButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Avvia',
        on: { click: toggle }
      });
      const resetButton = el('button', {
        class: 'btn btn--ghost',
        type: 'button',
        text: 'Azzera',
        on: { click: reset }
      });
      const fullscreenLabel = el('span', { text: 'Schermo intero' });
      const fullscreenButton = el('button', {
        class: 'btn btn--ghost',
        type: 'button',
        on: { click: () => App.ui.toggleFullscreen(stage) }
      }, [
        el('span', { class: 'btn__icon', html: App.art.ui.expand }),
        fullscreenLabel
      ]);

      const status = el('p', { class: 'hint--hand', 'aria-live': 'polite' });

      const panel = el('div', { class: 'timer-panel' }, [
        el('div', { class: 'timer-presets' }, presetButtons),
        el('label', { class: 'field' }, [
          el('span', { class: 'field__label', text: 'Oppure scegli i minuti' }),
          customInput
        ]),
        el('div', { class: 'timer-controls' }, [startButton, resetButton, fullscreenButton]),
        status,
        el('p', { class: 'timer-note' }, [
          'Suggerimento: premi ',
          el('strong', { text: 'spazio' }),
          ' per avviare o mettere in pausa, e lo schermo intero per farlo vedere a tutta la classe.'
        ])
      ]);

      const stage = el('div', { class: 'stage' },
        el('div', { class: 'timer-layout' }, [dial, panel])
      );

      const page = App.ui.page({
        kicker: 'Per la maestra',
        title: 'Timer di classe',
        lead: 'Un conto alla rovescia grande, chiaro e un po’ magico. Scegli i minuti, avvia e lascia che il tempo scorra.',
        back: { href: 'strumenti', label: 'Tutti gli strumenti' }
      });
      page.append(stage);
      root.append(page);

      /** Disegna lo stato corrente. */
      function paint() {
        readout.textContent = clock(remaining);
        readoutLabel.textContent = done ? 'tempo scaduto' : 'rimasti';

        const fraction = total > 0 ? remaining / total : 0;
        ring.style.strokeDashoffset = String(RING_LENGTH * (1 - fraction));
        ring.style.stroke = done || (running && remaining <= 10) ? 'var(--coral)' : 'var(--marigold)';
        dial.classList.toggle('is-done', done);

        startButton.textContent = done ? 'Ricomincia' : running ? 'Pausa' : remaining < total ? 'Riprendi' : 'Avvia';
        status.textContent = done ? 'Tempo scaduto!' : running ? 'Il tempo scorre…' : remaining < total ? 'In pausa' : 'Pronto quando vuoi.';
        customInput.value = String(minutes);
        presetButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(Number(button.dataset.minutes) === minutes));
        });
      }

      function setMinutes(value) {
        minutes = clamp(Math.round(value) || 5, MIN_MINUTES, MAX_MINUTES);
        total = minutes * 60;
        remaining = total;
        running = false;
        done = false;
        App.store.set('timer.minutes', minutes);
        App.sound.click();
        paint();
      }

      function toggle() {
        if (done) {
          remaining = total;
          done = false;
        }
        if (running) {
          remaining = Math.max(0, (endAt - performance.now()) / 1000);
          running = false;
          App.sound.click();
        } else {
          if (remaining <= 0) remaining = total;
          endAt = performance.now() + remaining * 1000;
          running = true;
          done = false;
          App.sound.click();
        }
        paint();
      }

      function reset() {
        running = false;
        done = false;
        remaining = total;
        App.sound.click();
        paint();
      }

      function tick() {
        if (!running) return;
        remaining = Math.max(0, (endAt - performance.now()) / 1000);
        if (remaining <= 0) {
          remaining = 0;
          running = false;
          done = true;
          App.sound.chime();
          App.ui.sparkles(dial, 24);
          App.ui.toast('Tempo scaduto!');
        }
        paint();
      }

      // Il timer vive solo finché la pagina è aperta: ctx pulisce l'intervallo.
      ctx.interval(tick, 100);
      ctx.on(document, 'fullscreenchange', () => {
        fullscreenLabel.textContent = document.fullscreenElement ? 'Esci' : 'Schermo intero';
      });
      ctx.on(window, 'keydown', (event) => {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (event.code === 'Space' && !['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(tag)) {
          event.preventDefault();
          toggle();
        }
      });

      paint();
    }
  });
})(window.App = window.App || {});
