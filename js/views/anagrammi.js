/* ============================================================
   anagrammi.js — Anagrammi incantati.
   Sessanta secondi per rimettere in ordine più parole possibili.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const DURATION = 60;
  const STORAGE_MODE = 'anagrammi.mode';
  const STORAGE_BEST = 'anagrammi.best';

  const MODES = [
    { id: 'corte', label: 'Corte', description: 'Parole di 4 o 5 lettere.', test: (word) => word.length <= 5 },
    { id: 'medie', label: 'Medie', description: 'Parole di 6 o 7 lettere.', test: (word) => word.length >= 6 && word.length <= 7 },
    { id: 'lunghe', label: 'Lunghe', description: 'Parole di 8 lettere o più.', test: (word) => word.length >= 8 }
  ];

  const wordsFor = (mode) => {
    const definition = MODES.find((item) => item.id === mode) || MODES[1];
    return App.data.words.filter((item) => definition.test(item.word));
  };

  /** Mescola le lettere evitando che la soluzione resti identica. */
  function scrambledLetters(word) {
    const letters = word.split('');
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const candidate = App.util.shuffle(letters);
      if (candidate.join('') !== word) return candidate;
    }
    return letters.slice().reverse();
  }

  App.router.register('anagrammi', {
    title: 'Anagrammi incantati',
    section: 'giochi',
    mount(root, ctx) {
      let mode = App.store.get(STORAGE_MODE, 'medie');
      if (!MODES.some((item) => item.id === mode)) mode = 'medie';
      let best = Number(App.store.get(STORAGE_BEST, 0)) || 0;

      let state = 'start'; // start | playing | over
      let solved = 0;
      let timeLeft = DURATION;
      let endAt = 0;
      let word = '';
      let lastWord = '';
      let tiles = [];
      let answer = [];
      let locked = false;
      let roundToken = 0;

      /* ---- HUD ---- */
      const solvedStat = el('strong', { text: '0' });
      const timeStat = el('strong', { text: App.util.clock(DURATION) });
      const bestStat = el('strong', { text: String(best) });
      const barFill = el('span');
      const bar = el('div', { class: 'game-bar' }, barFill);
      const hud = el('div', { class: 'game-hud' }, [
        el('div', { class: 'hud-stats' }, [
          App.ui.hudStat(solvedStat, 'parole'),
          App.ui.hudStat(timeStat, 'tempo'),
          App.ui.hudStat(bestStat, 'record')
        ])
      ]);

      /* ---- Gioco ---- */
      const hintCategory = el('span', { class: 'anagram-hint__category' });
      const hintText = el('p', { class: 'anagram-hint__text' });
      const hintCard = el('div', { class: 'anagram-hint' }, [hintCategory, hintText]);
      const answerRow = el('div', { class: 'anagram-answer', role: 'group' });
      const tilesRow = el('div', { class: 'letter-tiles', role: 'group', 'aria-label': 'Lettere da usare' });
      const status = el('p', { class: 'game-status anagram-status', 'aria-live': 'polite' });

      const clearButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        text: 'Cancella',
        on: { click: resetAnswer }
      });
      const shuffleButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        text: 'Mescola',
        on: { click: shuffleTiles }
      });

      const gameView = el('div', { class: 'anagram-layout' }, [
        hud,
        bar,
        hintCard,
        answerRow,
        tilesRow,
        status,
        el('div', { class: 'anagram-controls' }, [clearButton, shuffleButton])
      ]);

      /* ---- Schermata iniziale ---- */
      const modeHint = el('p', { class: 'hint', 'aria-live': 'polite' });
      const modeButtons = MODES.map((item) =>
        el('button', {
          class: 'chip',
          type: 'button',
          'aria-pressed': String(item.id === mode),
          dataset: { mode: item.id },
          text: item.label,
          on: { click: () => selectMode(item.id) }
        })
      );
      const startView = el('div', { class: 'game-start' }, [
        el('div', { class: 'game-start__art', html: App.art.icons.flower }),
        el('h2', { text: 'Rimetti le lettere in ordine' }),
        el('p', { class: 'hint', text: 'Leggi l’indizio, tocca le lettere e ricomponi la parola. Puoi cancellare e mescolare quanto vuoi.' }),
        el('div', { class: 'timer-presets', role: 'group', 'aria-label': 'Lunghezza delle parole' }, modeButtons),
        modeHint,
        el('button', {
          class: 'btn btn--primary btn--lg',
          type: 'button',
          text: 'Inizia',
          on: { click: startGame }
        })
      ]);

      const stage = el('div', { class: 'stage' });
      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'Anagrammi incantati',
        lead: 'Le lettere si sono sparse sul tavolo. Rimettile nell’ordine giusto e scopri la parola nascosta: hai sessanta secondi.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function tileById(id) {
        return tiles.find((tile) => tile.id === id);
      }

      function paintHud() {
        solvedStat.textContent = String(solved);
        bestStat.textContent = String(best);
        timeStat.textContent = App.util.clock(Math.max(0, (endAt - performance.now()) / 1000));
      }

      function paintModes() {
        App.ui.syncPressed(modeButtons, (button) => button.dataset.mode === mode);
      }

      function paintModeHint() {
        const definition = MODES.find((item) => item.id === mode);
        modeHint.textContent = definition ? definition.description : '';
      }

      function renderTiles() {
        tilesRow.replaceChildren(...tiles.map((tile) => {
          const used = answer.includes(tile.id);
          return el('button', {
            class: `letter-tile${used ? ' is-used' : ''}`,
            type: 'button',
            text: tile.char,
            'aria-label': `Lettera ${tile.char}`,
            disabled: used || locked || state !== 'playing',
            on: { click: () => pickTile(tile.id) }
          });
        }));
      }

      function renderAnswer() {
        const chosen = answer.map((id) => {
          const tile = tileById(id);
          return tile ? tile.char : '';
        });
        answerRow.replaceChildren(...Array.from({ length: word.length }, (_, index) => {
          const id = answer[index];
          if (id == null) return el('span', { class: 'answer-slot is-empty' });
          const tile = tileById(id);
          return el('button', {
            class: 'answer-slot is-filled',
            type: 'button',
            text: tile ? tile.char : '',
            'aria-label': `Togli la lettera ${tile ? tile.char : ''}`,
            on: { click: () => unpick(index) }
          });
        }));
        answerRow.setAttribute('aria-label', `La tua risposta: ${chosen.length ? chosen.join(' ') : 'vuota'}`);
      }

      function resetAnswer() {
        if (locked) return;
        answer = [];
        renderAnswer();
        renderTiles();
        if (state === 'playing') App.sound.click();
      }

      function unpick(index) {
        if (locked || index < 0 || index >= answer.length) return;
        answer.splice(index, 1);
        renderAnswer();
        renderTiles();
        App.sound.click();
      }

      function shuffleTiles() {
        if (locked || state !== 'playing') return;
        tiles = App.util.shuffle(tiles);
        renderTiles();
        App.sound.flip();
      }

      function pickTile(id) {
        if (state !== 'playing' || locked || answer.includes(id)) return;
        answer.push(id);
        renderTiles();
        renderAnswer();
        App.sound.click();
        if (answer.length === word.length) checkWord();
      }

      function checkWord() {
        const attempt = answer.map((id) => tileById(id).char).join('');
        const token = roundToken;

        if (attempt === word) {
          locked = true;
          solved += 1;
          paintHud();
          App.sound.success();
          App.ui.sparkles(answerRow, 18);
          status.textContent = `Parola trovata: ${word.toLowerCase()}!`;
          renderTiles();
          ctx.timeout(() => {
            if (token !== roundToken || state !== 'playing') return;
            nextWord();
          }, 700);
          return;
        }

        locked = true;
        App.sound.error();
        status.textContent = 'Non è ancora giusta: le lettere vanno in un altro ordine.';
        answerRow.classList.add('is-wrong');
        renderTiles();
        ctx.timeout(() => {
          if (token !== roundToken) return;
          answerRow.classList.remove('is-wrong');
          answer = [];
          locked = false;
          renderAnswer();
          renderTiles();
        }, 700);
      }

      function nextWord() {
        roundToken += 1;
        const pool = wordsFor(mode);
        const fresh = pool.length > 1 ? pool.filter((item) => item.word !== lastWord) : pool;
        const entry = App.util.pick(fresh.length ? fresh : pool);

        word = entry.word;
        lastWord = word;
        tiles = scrambledLetters(word).map((char, index) => ({ id: index, char }));
        answer = [];
        locked = false;
        hintCategory.textContent = entry.category;
        hintText.textContent = entry.hint;
        status.textContent = 'Tocca le lettere nell’ordine giusto.';
        answerRow.classList.remove('is-wrong');
        renderAnswer();
        renderTiles();
      }

      function startGame() {
        state = 'playing';
        solved = 0;
        timeLeft = DURATION;
        endAt = performance.now() + DURATION * 1000;
        barFill.style.width = '100%';
        barFill.style.background = 'var(--teal)';
        stage.replaceChildren(gameView);
        paintHud();
        nextWord();
        App.sound.click();
      }

      function endGame() {
        if (state !== 'playing') return;
        state = 'over';
        roundToken += 1;
        const isRecord = solved > best;
        if (isRecord) {
          best = solved;
          App.store.set(STORAGE_BEST, best);
        }
        paintHud();
        timeStat.textContent = App.util.clock(timeLeft);

        let title = 'Le lettere aspettano';
        if (solved >= 10) title = 'Campionessa di parole!';
        else if (solved >= 6) title = 'Che orecchio per le lettere!';
        else if (solved >= 3) title = 'Buon lavoro!';

        const result = App.ui.resultPanel({
          title,
          message: isRecord
            ? 'Nuovo record! Le lettere si sono messe in fila per te.'
            : solved === 0
              ? 'Questa volta nessuna parola: riprova con calma, l’indizio è sempre lì.'
              : App.util.pick(App.data.praises),
          mood: solved > 0 ? 'win' : 'lose',
          stats: [
            { value: String(solved), label: 'Parole' },
            { value: App.util.clock(DURATION - timeLeft), label: 'Tempo' },
            { value: String(best), label: 'Record' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Rigioca',
              on: { click: startGame }
            }),
            el('button', {
              class: 'btn btn--ghost',
              type: 'button',
              text: 'Cambia difficoltà',
              on: { click: showStart }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        });
        stage.replaceChildren(result);
        if (solved > 0) {
          App.sound.chime();
          App.ui.sparkles(result, 22);
        } else {
          App.sound.pop();
        }
        result.scrollIntoView({ behavior: App.util.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }

      function selectMode(nextMode) {
        mode = nextMode;
        App.store.set(STORAGE_MODE, mode);
        paintModes();
        paintModeHint();
        App.sound.click();
      }

      function showStart() {
        state = 'start';
        paintModes();
        paintModeHint();
        stage.replaceChildren(startView);
      }

      ctx.interval(() => {
        if (state !== 'playing') return;
        timeLeft = Math.max(0, (endAt - performance.now()) / 1000);
        timeStat.textContent = App.util.clock(timeLeft);
        barFill.style.width = `${(timeLeft / DURATION) * 100}%`;
        barFill.style.background = timeLeft <= 10 ? 'var(--coral)' : 'var(--teal)';
        if (timeLeft <= 0) endGame();
      }, 100);

      ctx.on(window, 'keydown', (event) => {
        if (event.repeat || state !== 'playing' || locked) return;
        if (event.key === 'Backspace') {
          event.preventDefault();
          unpick(answer.length - 1);
          return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const letter = event.key.toUpperCase();
        if (letter.length !== 1) return;
        const tile = tiles.find((item) => item.char === letter && !answer.includes(item.id));
        if (tile) {
          event.preventDefault();
          pickTile(tile.id);
        }
      });

      paintModes();
      paintModeHint();
      showStart();
    }
  });
})(window.App = window.App || {});
