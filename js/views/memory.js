/* ============================================================
   memory.js — Memory incantato.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const LEVELS = [
    { pairs: 6, label: 'Piccolo' },
    { pairs: 8, label: 'Classico' },
    { pairs: 10, label: 'Grande' }
  ];

  App.router.register('memory', {
    title: 'Memory incantato',
    section: 'giochi',
    mount(root, ctx) {
      let pairs = Number(App.store.get('memory.pairs', 8));
      if (!LEVELS.some((level) => level.pairs === pairs)) pairs = 8;

      let deck = [];
      let cards = [];
      let flipped = [];
      let lock = false;
      let matched = 0;
      let moves = 0;
      let startTime = null;
      let finished = false;

      const grid = el('div', { class: 'memory-grid', style: { '--cols': '4' } });
      const status = el('p', { class: 'memory-status', 'aria-live': 'polite' });
      const resultArea = el('div', { class: 'memory-result' });

      const pairsStat = el('strong', { text: '0' });
      const movesStat = el('strong', { text: '0' });
      const timeStat = el('strong', { text: '00:00' });

      const levelButtons = LEVELS.map((level) =>
        el('button', {
          type: 'button',
          'aria-pressed': String(level.pairs === pairs),
          text: `${level.label} · ${level.pairs} coppie`,
          dataset: { pairs: String(level.pairs) },
          on: { click: () => startGame(level.pairs) }
        })
      );

      const restartButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        html: `<span class="btn__icon">${App.art.ui.restart}</span><span>Ricomincia</span>`,
        on: { click: () => startGame(pairs) }
      });

      const hud = el('div', { class: 'game-hud' }, [
        el('div', { class: 'hud-stats' }, [
          el('div', { class: 'hud-stat' }, [pairsStat, el('span', { text: 'coppie' })]),
          el('div', { class: 'hud-stat' }, [movesStat, el('span', { text: 'mosse' })]),
          el('div', { class: 'hud-stat' }, [timeStat, el('span', { text: 'tempo' })])
        ]),
        el('div', { class: 'game-actions' }, [
          el('div', { class: 'segmented', role: 'group', 'aria-label': 'Livello' }, levelButtons),
          restartButton
        ])
      ]);

      const stage = el('div', { class: 'stage' }, [
        hud,
        el('div', { class: 'memory-layout' }, [grid, status, resultArea])
      ]);

      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'Memory incantato',
        lead: 'Trova tutte le coppie di lune, funghi e fantasmi. Meno mosse fai, più la tua memoria è magica.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function elapsedSeconds() {
        if (startTime === null) return 0;
        return Math.floor((performance.now() - startTime) / 1000);
      }

      function paintStats() {
        pairsStat.textContent = String(matched);
        movesStat.textContent = String(moves);
        timeStat.textContent = App.util.clock(elapsedSeconds());
      }

      function paintLevels() {
        levelButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(Number(button.dataset.pairs) === pairs));
        });
      }

      function startGame(nextPairs) {
        pairs = nextPairs;
        App.store.set('memory.pairs', pairs);
        deck = App.util.shuffle(App.data.memoryPairs.slice(0, pairs)).flatMap((pair, index) => [
          { ...pair, uid: `${index}-a` },
          { ...pair, uid: `${index}-b` }
        ]);
        deck = App.util.shuffle(deck);

        flipped = [];
        lock = false;
        matched = 0;
        moves = 0;
        startTime = null;
        finished = false;
        resultArea.replaceChildren();
        grid.replaceChildren();
        status.textContent = 'Tocca due carte per cominciare.';
        paintStats();
        paintLevels();

        cards = deck.map((card, index) => {
          const button = el('button', {
            class: 'memory-card',
            type: 'button',
            'aria-label': `Carta ${index + 1}, coperta`,
            dataset: { index: String(index) },
            on: { click: () => flip(index) }
          }, [
            el('span', { class: 'memory-card__inner' }, [
              el('span', { class: 'memory-card__face memory-card__face--back', html: App.art.deco.star4('var(--butter)') }),
              el('span', { class: 'memory-card__face memory-card__face--front', html: App.art.icons[card.art] })
            ])
          ]);
          grid.append(button);
          return button;
        });
      }

      function revealLabel(index, suffix = '') {
        return `Carta ${index + 1}, ${deck[index].name}${suffix}`;
      }

      function flip(index) {
        if (lock || finished) return;
        const card = cards[index];
        if (!card || card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;

        if (startTime === null) startTime = performance.now();
        card.classList.add('is-flipped');
        card.setAttribute('aria-label', revealLabel(index));
        App.sound.flip();
        flipped.push(index);

        if (flipped.length < 2) return;

        const [first, second] = flipped;
        moves += 1;
        paintStats();
        lock = true;

        if (deck[first].name === deck[second].name) {
          deck[first].matched = true;
          deck[second].matched = true;
          cards[first].classList.add('is-matched');
          cards[second].classList.add('is-matched');
          cards[first].disabled = true;
          cards[second].disabled = true;
          cards[first].setAttribute('aria-label', revealLabel(first, ', trovata'));
          cards[second].setAttribute('aria-label', revealLabel(second, ', trovata'));
          matched += 1;
          flipped = [];
          lock = false;
          paintStats();
          status.textContent = `Coppia trovata! ${matched} su ${pairs}.`;
          App.sound.success();
          if (matched === pairs) win();
          return;
        }

        cards[first].classList.add('is-wrong');
        cards[second].classList.add('is-wrong');
        status.textContent = 'Non è la stessa carta. Riprova!';
        ctx.timeout(() => {
          cards[first].classList.remove('is-flipped', 'is-wrong');
          cards[second].classList.remove('is-flipped', 'is-wrong');
          cards[first].setAttribute('aria-label', `Carta ${first + 1}, coperta`);
          cards[second].setAttribute('aria-label', `Carta ${second + 1}, coperta`);
          flipped = [];
          lock = false;
        }, 850);
      }

      function win() {
        finished = true;
        const seconds = elapsedSeconds();
        App.sound.chime();
        App.ui.sparkles(grid, 30);
        status.textContent = 'Hai trovato tutte le coppie!';

        const result = App.ui.resultPanel({
          title: 'Memoria da campionessa',
          message: App.util.pick(App.data.praises),
          stats: [
            { value: String(moves), label: 'Mosse' },
            { value: App.util.clock(seconds), label: 'Tempo' },
            { value: `${pairs}/${pairs}`, label: 'Coppie' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Gioca ancora',
              on: { click: () => startGame(pairs) }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        });
        resultArea.replaceChildren(result);
        result.scrollIntoView({ behavior: App.util.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }

      ctx.interval(() => {
        if (startTime !== null && !finished) timeStat.textContent = App.util.clock(elapsedSeconds());
      }, 250);

      startGame(pairs);
    }
  });
})(window.App = window.App || {});
