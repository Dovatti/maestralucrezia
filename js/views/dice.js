/* ============================================================
   dadi.js — Dadi e moneta, con animazioni leggere.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const PIP_POSITIONS = {
    1: [[50, 50]],
    2: [[31, 31], [69, 69]],
    3: [[31, 31], [50, 50], [69, 69]],
    4: [[31, 31], [69, 31], [31, 69], [69, 69]],
    5: [[31, 31], [69, 31], [50, 50], [31, 69], [69, 69]],
    6: [[31, 27], [69, 27], [31, 50], [69, 50], [31, 73], [69, 73]]
  };

  function dieSvg(value, variant) {
    const fill = variant === 1 ? 'var(--lilac)' : 'var(--bone)';
    const pips = PIP_POSITIONS[value]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="var(--ink)"/>`)
      .join('');
    return `
      <svg class="die" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <rect x="4" y="4" width="92" height="92" rx="20" fill="${fill}" stroke="var(--ink)" stroke-width="4"/>
        <path d="M20 23c7-7 16-10 27-10" fill="none" stroke="var(--bone)" stroke-width="4" stroke-linecap="round" opacity=".65"/>
        ${pips}
      </svg>`;
  }

  function coinSvg(face) {
    const center = face === 'testa'
      ? `<path d="M61 28a22 22 0 1 0 12 33A24 24 0 0 1 61 28Z" fill="var(--butter)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
         <circle cx="47" cy="47" r="2" fill="var(--ink)"/>
         <path d="M41 54c4 3 9 3 13 0" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>`
      : `<path d="M50 23l7.5 16.5L75 41.5 63 53l3 18-16-9-16 9 3-18-12-11.5 17.5-2Z" fill="var(--lavender)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>`;
    return `
      <svg class="coin" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r="46" fill="var(--marigold)" stroke="var(--ink)" stroke-width="4"/>
        <circle cx="50" cy="50" r="37" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 5" opacity=".45"/>
        ${center}
      </svg>`;
  }

  App.router.register('dadi', {
    title: 'Dadi e monete',
    section: 'strumenti',
    mount(root, ctx) {
      let diceCount = Number(App.store.get('dice.count', 1)) === 2 ? 2 : 1;
      let rollingDice = false;
      let flippingCoin = false;

      /* ---- Dadi ---- */
      const diceRow = el('div', { class: 'die-row' });
      const diceResult = el('div', { class: 'dice-result', 'aria-live': 'polite' });
      const rollButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Tira il dado',
        on: { click: rollDice }
      });
      const diceCountButtons = [1, 2].map((value) =>
        el('button', {
          type: 'button',
          'aria-pressed': String(value === diceCount),
          text: value === 1 ? '1 dado' : '2 dadi',
          dataset: { count: String(value) },
          on: { click: () => setDiceCount(value) }
        })
      );
      const diceSegmented = el('div', { class: 'segmented', role: 'group', 'aria-label': 'Numero di dadi' }, diceCountButtons);

      const dicePanel = el('section', { class: 'dice-panel' }, [
        el('h2', { text: 'Il dado' }),
        diceSegmented,
        diceRow,
        diceResult,
        rollButton
      ]);

      /* ---- Moneta ---- */
      const coinWrap = el('div', { class: 'die-row' });
      const coinResult = el('div', { class: 'dice-result', 'aria-live': 'polite' });
      const coinButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Lancia la moneta',
        on: { click: flipCoin }
      });
      const coinPanel = el('section', { class: 'dice-panel' }, [
        el('h2', { text: 'La moneta' }),
        coinWrap,
        coinResult,
        coinButton
      ]);

      const stage = el('div', { class: 'stage' },
        el('div', { class: 'dice-layout' }, [dicePanel, coinPanel])
      );
      const page = App.ui.page({
        kicker: 'Per la maestra',
        title: 'Dadi e monete',
        lead: 'Per un gioco veloce, una decisione da prendere o una piccola sfida di matematica. Il caso fa il resto.',
        back: { href: 'strumenti', label: 'Tutti gli strumenti' }
      });
      page.append(stage);
      root.append(page);

      function paintDiceCount() {
        diceCountButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(Number(button.dataset.count) === diceCount));
        });
        rollButton.textContent = diceCount === 1 ? 'Tira il dado' : 'Tira i dadi';
      }

      function buildDiceRow() {
        diceRow.replaceChildren(
          ...Array.from({ length: diceCount }, (_, index) =>
            el('div', { class: 'die-wrap', html: dieSvg(index + 1, index) })
          )
        );
      }

      function showDiceResult(values) {
        if (!values) {
          diceResult.replaceChildren(
            el('strong', { text: '?' }),
            el('small', { text: 'premi il bottone' })
          );
          return;
        }
        if (values.length === 1) {
          diceResult.replaceChildren(
            el('strong', { text: String(values[0]) }),
            el('small', { text: 'è uscito' })
          );
          return;
        }
        const total = values.reduce((sum, value) => sum + value, 0);
        diceResult.replaceChildren(
          el('strong', { text: String(total) }),
          el('small', { text: `${values[0]} + ${values[1]}` })
        );
      }

      function setDiceCount(value) {
        if (rollingDice) return;
        diceCount = value === 2 ? 2 : 1;
        App.store.set('dice.count', diceCount);
        paintDiceCount();
        buildDiceRow();
        showDiceResult(null);
        App.sound.click();
      }

      function rollDice() {
        if (rollingDice) return;
        rollingDice = true;
        rollButton.disabled = true;
        const finalValues = Array.from({ length: diceCount }, () => App.util.randInt(6) + 1);
        const stopAt = performance.now() + 520;

        function frame() {
          if (performance.now() < stopAt) {
            diceRow.querySelectorAll('.die-wrap').forEach((wrapper, index) => {
              wrapper.innerHTML = dieSvg(App.util.randInt(6) + 1, index);
            });
            App.sound.tick();
            ctx.timeout(frame, 70);
            return;
          }
          diceRow.querySelectorAll('.die-wrap').forEach((wrapper, index) => {
            wrapper.innerHTML = dieSvg(finalValues[index], index);
          });
          showDiceResult(finalValues);
          rollingDice = false;
          rollButton.disabled = false;
          App.sound.pop();
          App.sound.success();
          App.ui.sparkles(diceRow, 12);
        }

        frame();
      }

      /* ---- Moneta ---- */
      function showCoin(face) {
        if (!face) {
          coinResult.replaceChildren(
            el('strong', { text: '?' }),
            el('small', { text: 'premi il bottone' })
          );
          return;
        }
        coinResult.replaceChildren(
          el('strong', { text: face === 'testa' ? 'Testa' : 'Croce' }),
          el('small', { text: face === 'testa' ? 'la luna' : 'la stella' })
        );
      }

      function flipCoin() {
        if (flippingCoin) return;
        flippingCoin = true;
        coinButton.disabled = true;
        const finalFace = App.util.randInt(2) === 0 ? 'testa' : 'croce';
        const stopAt = performance.now() + 620;

        // L'animazione sta sul contenitore: ogni nuovo disegno della moneta
        // riparte da capo, così il lancio sembra continuo.
        coinWrap.classList.add('is-flipping');

        function frame() {
          if (performance.now() < stopAt) {
            coinWrap.innerHTML = coinSvg(App.util.randInt(2) === 0 ? 'testa' : 'croce');
            App.sound.tick();
            ctx.timeout(frame, 80);
            return;
          }
          coinWrap.classList.remove('is-flipping');
          coinWrap.innerHTML = coinSvg(finalFace);
          showCoin(finalFace);
          flippingCoin = false;
          coinButton.disabled = false;
          App.sound.pop();
          App.sound.success();
          App.ui.sparkles(coinWrap, 12);
        }

        frame();
      }

      paintDiceCount();
      buildDiceRow();
      showDiceResult(null);
      coinWrap.innerHTML = coinSvg('testa');
      showCoin(null);
    }
  });
})(window.App = window.App || {});
