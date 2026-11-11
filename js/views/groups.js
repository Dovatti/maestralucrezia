/* ============================================================
   gruppi.js — Fabbrica di gruppi equilibrati.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;
  const { clamp } = App.util;

  const STORAGE_NAMES = 'class.names';
  const STORAGE_COUNT = 'groups.count';
  const MIN_GROUPS = 2;
  const MAX_GROUPS = 8;

  function readNames(text) {
    return text
      .split('\n')
      .map((name) => name.trim())
      .filter(Boolean);
  }

  App.router.register('gruppi', {
    title: 'Fabbrica di gruppi',
    section: 'strumenti',
    mount(root, ctx) {
      const stored = App.store.get(STORAGE_NAMES, null);
      let count = clamp(Number(App.store.get(STORAGE_COUNT, 3)) || 3, MIN_GROUPS, MAX_GROUPS);
      let hasGroups = false;

      const textarea = el('textarea', {
        class: 'textarea',
        rows: '9',
        spellcheck: 'false',
        'aria-label': 'Nomi da dividere in gruppi, uno per riga',
        placeholder: 'Un nome per riga…'
      });
      textarea.value = (stored && stored.length ? stored : App.data.demoNames).join('\n');

      const countValue = el('span', { class: 'stepper__value', text: String(count), 'aria-live': 'polite' });
      const minusButton = el('button', {
        class: 'icon-btn',
        type: 'button',
        'aria-label': 'Un gruppo in meno',
        html: App.art.ui.minus,
        on: { click: () => setCount(count - 1) }
      });
      const plusButton = el('button', {
        class: 'icon-btn',
        type: 'button',
        'aria-label': 'Un gruppo in più',
        html: App.art.ui.plus,
        on: { click: () => setCount(count + 1) }
      });

      const createButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Crea i gruppi',
        on: { click: createGroups }
      });
      const printButton = el('button', {
        class: 'btn btn--ghost btn--sm no-print',
        type: 'button',
        html: `<span class="btn__icon">${App.art.ui.print}</span><span>Stampa</span>`,
        disabled: true,
        on: { click: () => window.print() }
      });

      const panel = el('div', { class: 'panel' }, [
        el('h2', { class: 'panel__title', text: 'La classe' }),
        el('p', { class: 'hint', text: 'Un nome per riga. L’elenco è lo stesso del sorteggio e resta sul tuo dispositivo.' }),
        textarea,
        el('div', { class: 'panel__row' }, [
          el('span', { class: 'field__label', text: 'Numero di gruppi' }),
          el('div', { class: 'stepper' }, [minusButton, countValue, plusButton])
        ]),
        createButton,
        el('p', { class: 'hint', text: 'I gruppi vengono distribuiti a giro, così restano equilibrati anche quando i nomi non sono divisibili.' })
      ]);

      const emptyState = el('div', { class: 'groups-empty' }, [
        el('p', { class: 'hint--hand', text: 'Qui appariranno le squadre.' }),
        el('p', { class: 'hint', text: 'Scrivi i nomi, scegli quanti gruppi vuoi e premi “Crea i gruppi”.' })
      ]);
      const resultArea = el('div', { class: 'groups-result', 'aria-live': 'polite' }, [emptyState]);
      const summary = el('p', { class: 'counter' });

      const result = el('div', { class: 'groups-result-wrap' }, [
        el('div', { class: 'tool-bar tool-bar--between no-print' }, [
          el('div', {}, [el('h2', { class: 'panel__title', text: 'Le squadre' }), summary]),
          printButton
        ]),
        resultArea
      ]);

      const stage = el('div', { class: 'stage' },
        el('div', { class: 'groups-layout' }, [panel, result])
      );

      const page = App.ui.page({
        kicker: 'Per la maestra',
        title: 'Fabbrica di gruppi',
        lead: 'Dividi la classe in squadre equilibrate senza contare a mano. Ogni gruppo ha un nome, un colore e i suoi membri.',
        back: { href: 'strumenti', label: 'Tutti gli strumenti' }
      });
      page.append(stage);
      root.append(page);

      function setCount(value) {
        count = clamp(value, MIN_GROUPS, MAX_GROUPS);
        countValue.textContent = String(count);
        minusButton.disabled = count <= MIN_GROUPS;
        plusButton.disabled = count >= MAX_GROUPS;
        App.store.set(STORAGE_COUNT, count);
      }

      function createGroups() {
        const names = readNames(textarea.value);
        if (names.length < 2) {
          App.ui.toast('Servono almeno due nomi per fare i gruppi.', 'error');
          textarea.focus();
          return;
        }

        let groupCount = count;
        if (groupCount > names.length) {
          groupCount = names.length;
          setCount(groupCount);
          App.ui.toast('Ci sono meno nomi che gruppi: ho ridotto il numero di squadre.');
        }

        const groups = App.util.splitIntoGroups(names, groupCount);
        const grid = el('div', { class: 'group-grid' });

        groups.forEach((members, index) => {
          const team = App.data.teams[index] || {
            name: `Numero ${index + 1}`,
            color: 'var(--paper-2)',
            soft: 'var(--paper)'
          };
          grid.append(
            el('article', {
              class: 'group-card',
              style: { '--accent': team.color, '--soft': team.soft }
            }, [
              el('header', { class: 'group-card__head' }, [
                el('h3', { class: 'group-card__name', text: `Squadra ${team.name}` }),
                el('span', { class: 'group-card__count', text: `${members.length} ${members.length === 1 ? 'nome' : 'nomi'}` })
              ]),
              el('ul', { class: 'group-card__list' }, members.map((member) => el('li', { text: member })))
            ])
          );
        });

        resultArea.replaceChildren(grid);
        summary.textContent = `${groupCount} ${groupCount === 1 ? 'gruppo' : 'gruppi'} · ${names.length} nomi`;
        printButton.disabled = false;
        createButton.textContent = hasGroups ? 'Rimescola' : 'Crea i gruppi';
        hasGroups = true;
        App.sound.success();
        App.ui.sparkles(grid, 16);
      }

      textarea.addEventListener('input', () => {
        App.store.set(STORAGE_NAMES, readNames(textarea.value));
      });

      setCount(count);
    }
  });
})(window.App = window.App || {});
