/* ============================================================
   sorteggio.js — La carta del sorteggio.
   I nomi restano nel browser; l'estrazione usa crypto.random.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const STORAGE_NAMES = 'class.names';
  const STORAGE_NOREPEAT = 'picker.noRepeat';

  function readNames(text) {
    return text
      .split('\n')
      .map((name) => name.trim())
      .filter(Boolean);
  }

  App.router.register('sorteggio', {
    title: 'La carta del sorteggio',
    section: 'strumenti',
    mount(root, ctx) {
      const stored = App.store.get(STORAGE_NAMES, null);
      let noRepeat = Boolean(App.store.get(STORAGE_NOREPEAT, true));
      let drawing = false;
      const drawn = new Set();

      const nameDisplay = el('p', { class: 'draw-name', text: 'Chi sarà?' });
      const liveRegion = el('p', { class: 'sr-only', 'aria-live': 'assertive' });
      const drawButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Estrai un nome',
        on: { click: draw }
      });
      const drawCard = el('div', { class: 'draw-card' }, [
        el('span', { class: 'draw-card__label', text: 'La carta dice…' }),
        nameDisplay,
        el('div', { class: 'draw-card__actions' }, [drawButton]),
        liveRegion
      ]);

      const textarea = el('textarea', {
        class: 'textarea',
        rows: '9',
        spellcheck: 'false',
        'aria-label': 'Nomi da sorteggiare, uno per riga',
        placeholder: 'Un nome per riga:\nAda\nBruno\nClara…'
      });
      textarea.value = (stored && stored.length ? stored : App.data.demoNames).join('\n');

      const counter = el('p', { class: 'counter', 'aria-live': 'polite' });
      const noRepeatInput = el('input', { type: 'checkbox', checked: noRepeat });
      const resetButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        text: 'Rimetti tutti in gioco',
        on: {
          click: () => {
            drawn.clear();
            App.sound.click();
            App.ui.toast('Tutti i nomi sono di nuovo in gioco.');
            paintCounter();
          }
        }
      });

      const panel = el('div', { class: 'panel' }, [
        el('h2', { class: 'panel__title', text: 'I nomi' }),
        el('p', { class: 'hint', text: 'Uno per riga. Restano sul tuo dispositivo e non vengono inviati da nessuna parte.' }),
        textarea,
        el('div', { class: 'panel__row' }, [counter, resetButton]),
        el('label', { class: 'switch' }, [noRepeatInput, el('span', { text: 'Togli il nome estratto' })])
      ]);

      const stage = el('div', { class: 'stage' },
        el('div', { class: 'picker-layout' }, [drawCard, panel])
      );

      const page = App.ui.page({
        kicker: 'Per la maestra',
        title: 'La carta del sorteggio',
        lead: 'Scrivi i nomi della classe, premi il bottone e lascia che sia la sorte a scegliere. Con un po’ di suspense, ma senza polemiche.',
        back: { href: 'strumenti', label: 'Tutti gli strumenti' }
      });
      page.append(stage);
      root.append(page);

      function paintCounter() {
        const names = readNames(textarea.value);
        const excluded = noRepeat ? names.filter((name) => drawn.has(name)).length : 0;
        counter.textContent = `${names.length} ${names.length === 1 ? 'nome' : 'nomi'} in elenco${excluded ? ` · ${excluded} già estratti` : ''}`;
      }

      function saveNames() {
        App.store.set(STORAGE_NAMES, readNames(textarea.value));
      }

      function draw() {
        if (drawing) return;
        const names = readNames(textarea.value);
        if (names.length < 1) {
          App.ui.toast('Scrivi almeno un nome nell’elenco.', 'error');
          textarea.focus();
          return;
        }

        let pool = noRepeat ? names.filter((name) => !drawn.has(name)) : names.slice();
        if (!pool.length) {
          drawn.clear();
          pool = names.slice();
          App.ui.toast('Giro completato: ricomincio da capo.');
        }

        const winner = App.util.pick(pool);
        drawing = true;
        drawButton.disabled = true;
        drawCard.classList.remove('is-winner');
        drawCard.classList.add('is-drawing');
        App.sound.click();

        const steps = 20;
        let step = 0;

        function frame() {
          if (step < steps) {
            nameDisplay.textContent = App.util.pick(pool);
            step += 1;
            ctx.timeout(frame, 40 + Math.pow(step / steps, 2) * 170);
            return;
          }

          nameDisplay.textContent = winner;
          liveRegion.textContent = `È uscito: ${winner}`;
          drawCard.classList.remove('is-drawing');
          drawCard.classList.add('is-winner');
          drawing = false;
          drawButton.disabled = false;
          if (noRepeat) drawn.add(winner);
          App.sound.pop();
          App.sound.success();
          App.ui.sparkles(drawCard, 26);
          paintCounter();
          ctx.timeout(() => drawCard.classList.remove('is-winner'), 600);
        }

        frame();
      }

      textarea.addEventListener('input', () => {
        drawn.clear();
        saveNames();
        paintCounter();
      });
      noRepeatInput.addEventListener('change', () => {
        noRepeat = noRepeatInput.checked;
        drawn.clear();
        App.store.set(STORAGE_NOREPEAT, noRepeat);
        paintCounter();
      });

      paintCounter();
    }
  });
})(window.App = window.App || {});
