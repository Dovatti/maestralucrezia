/* ============================================================
   parola.js — La parola segreta.
   Indovina la parola una lettera alla volta: sei tentativi,
   un indizio e una categoria per orientarsi.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const ALPHABET = 'ABCDEFGHILMNOPQRSTUVZ'.split('');
  const MAX_LIVES = 6;
  const STORAGE_CATEGORY = 'parola.category';
  const STORAGE_BEST = 'parola.bestStreak';

  const CATEGORIES = ['Tutte', ...new Set(App.data.words.map((item) => item.category))];

  App.router.register('parola', {
    title: 'La parola segreta',
    section: 'giochi',
    mount(root, ctx) {
      let category = App.store.get(STORAGE_CATEGORY, 'Tutte');
      if (!CATEGORIES.includes(category)) category = 'Tutte';
      let best = Number(App.store.get(STORAGE_BEST, 0)) || 0;
      let wins = 0;
      let streak = 0;
      let lastWord = '';
      let word = '';
      let hint = '';
      let wordCategory = '';
      let guessed = new Set();
      let wrong = 0;
      let over = false;

      /* ---- HUD ---- */
      const winsStat = el('strong', { text: '0' });
      const streakStat = el('strong', { text: '0' });
      const bestStat = el('strong', { text: String(best) });
      const lifeNodes = Array.from({ length: MAX_LIVES }, () =>
        el('span', { class: 'life', html: App.art.icons.moon })
      );
      const livesStat = el('strong', { class: 'lives', role: 'img' }, lifeNodes);

      /* ---- Tabellone ---- */
      const categoryLine = el('p', { class: 'parola-category' });
      const wordRow = el('div', { class: 'secret-word', role: 'group' });
      const hintValue = el('span');
      const hintLine = el('p', { class: 'parola-hint' }, [
        el('span', { class: 'parola-hint__label', text: 'Indizio: ' }),
        hintValue
      ]);
      const status = el('p', { class: 'game-status parola-status', 'aria-live': 'polite' });
      const resultArea = el('div', { class: 'parola-result' });

      /* ---- Categorie ---- */
      const categoryButtons = CATEGORIES.map((name) =>
        el('button', {
          class: 'chip',
          type: 'button',
          'aria-pressed': String(name === category),
          dataset: { category: name },
          text: name,
          on: { click: () => setCategory(name) }
        })
      );

      /* ---- Alfabeto ---- */
      const letterButtons = ALPHABET.map((letter) =>
        el('button', {
          class: 'letter-key',
          type: 'button',
          'aria-label': `Lettera ${letter}`,
          dataset: { letter },
          text: letter,
          on: { click: () => guess(letter) }
        })
      );

      const stage = el('div', { class: 'stage' }, [
        el('div', { class: 'game-hud' }, [
          el('div', { class: 'hud-stats' }, [
            App.ui.hudStat(winsStat, 'vinte'),
            App.ui.hudStat(streakStat, 'serie'),
            App.ui.hudStat(bestStat, 'record'),
            App.ui.hudStat(livesStat, 'vite')
          ])
        ]),
        el('div', { class: 'parola-layout' }, [
          el('div', { class: 'parola-board' }, [
            categoryLine,
            wordRow,
            hintLine,
            status
          ]),
          el('div', { class: 'parola-side panel' }, [
            el('h2', { class: 'panel__title', text: 'Categoria' }),
            el('div', { class: 'parola-categories', role: 'group', 'aria-label': 'Categoria' }, categoryButtons),
            el('h2', { class: 'panel__title', text: 'Scegli una lettera' }),
            el('div', { class: 'alphabet', role: 'group', 'aria-label': 'Lettere' }, letterButtons)
          ])
        ]),
        resultArea
      ]);

      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'La parola segreta',
        lead: 'Una parola si nasconde dietro i puntini. Scegli le lettere, leggi l’indizio e scoprila prima che finiscano le sei lune.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function paintHud() {
        winsStat.textContent = String(wins);
        streakStat.textContent = String(streak);
        bestStat.textContent = String(best);
        lifeNodes.forEach((node, index) => {
          node.classList.toggle('is-lost', index >= MAX_LIVES - wrong);
        });
        livesStat.setAttribute('aria-label', `${Math.max(0, MAX_LIVES - wrong)} vite su ${MAX_LIVES}`);
      }

      function paintCategories() {
        App.ui.syncPressed(categoryButtons, (button) => button.dataset.category === category);
      }

      function paintLetters() {
        letterButtons.forEach((button) => {
          const letter = button.dataset.letter;
          const used = guessed.has(letter);
          const right = used && word.includes(letter);
          button.disabled = over || used;
          button.classList.toggle('is-right', right);
          button.classList.toggle('is-wrong', used && !right);
        });
      }

      function paintWord(reveal = false) {
        wordRow.replaceChildren(...Array.from(word, (letter) => {
          const shown = reveal || guessed.has(letter);
          return el('span', {
            class: `letter-slot${shown ? ' is-filled' : ''}`,
            text: shown ? letter : '·'
          });
        }));
        const spoken = Array.from(word, (letter) =>
          reveal || guessed.has(letter) ? letter : 'punto'
        ).join(' ');
        wordRow.setAttribute('aria-label', `Parola di ${word.length} lettere: ${spoken}`);
      }

      function paintAll(reveal = false) {
        paintHud();
        paintCategories();
        paintLetters();
        paintWord(reveal);
      }

      function startRound() {
        const pool = category === 'Tutte'
          ? App.data.words
          : App.data.words.filter((item) => item.category === category);
        const fresh = pool.length > 1 ? pool.filter((item) => item.word !== lastWord) : pool;
        const entry = App.util.pick(fresh.length ? fresh : pool);

        word = entry.word;
        hint = entry.hint;
        wordCategory = entry.category;
        lastWord = word;
        guessed = new Set();
        wrong = 0;
        over = false;

        categoryLine.textContent = wordCategory;
        hintValue.textContent = hint;
        status.textContent = 'Scegli una lettera.';
        resultArea.replaceChildren();
        paintAll();
      }

      function finishRound(won) {
        over = true;
        if (won) {
          wins += 1;
          streak += 1;
          if (streak > best) {
            best = streak;
            App.store.set(STORAGE_BEST, best);
          }
          status.textContent = 'Hai indovinato! La parola era proprio quella.';
          App.sound.chime();
          App.ui.sparkles(wordRow, 26);
        } else {
          streak = 0;
          status.textContent = `Niente da fare: la parola era ${word}.`;
          App.sound.error();
        }

        resultArea.replaceChildren(App.ui.resultPanel({
          title: won ? 'Parola trovata!' : 'La parola resta segreta',
          message: won
            ? App.util.pick(App.data.praises)
            : 'Guarda l’indizio con calma: la prossima parola sarà più semplice.',
          mood: won ? 'win' : 'lose',
          stats: [
            { value: String(wins), label: 'Vinte' },
            { value: String(streak), label: 'Serie' },
            { value: String(best), label: 'Record' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Nuova parola',
              on: { click: () => { App.sound.click(); startRound(); } }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        }));
        paintAll(true);
        resultArea.scrollIntoView({ behavior: App.util.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }

      function guess(letter) {
        if (over || guessed.has(letter)) return;
        guessed.add(letter);

        if (word.includes(letter)) {
          App.sound.success();
          status.textContent = `La lettera ${letter} c’è!`;
        } else {
          wrong += 1;
          App.sound.error();
          status.textContent = `La lettera ${letter} non c’è. Restano ${Math.max(0, MAX_LIVES - wrong)} lune.`;
        }

        const solved = Array.from(word).every((char) => guessed.has(char));
        if (solved) {
          finishRound(true);
          return;
        }
        if (wrong >= MAX_LIVES) {
          finishRound(false);
          return;
        }
        paintAll();
      }

      function setCategory(nextCategory) {
        category = nextCategory;
        App.store.set(STORAGE_CATEGORY, category);
        App.sound.click();
        startRound();
      }

      ctx.on(window, 'keydown', (event) => {
        if (over || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        const letter = event.key.toUpperCase();
        if (letter.length !== 1 || !ALPHABET.includes(letter)) return;
        event.preventDefault();
        guess(letter);
      });

      startRound();
    }
  });
})(window.App = window.App || {});
