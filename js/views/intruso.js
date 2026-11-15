/* ============================================================
   intruso.js — Trova l'intruso.
   Dieci domande, quattro scelte e tre vite per allenare la logica.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const ROUNDS = 10;
  const MAX_LIVES = 3;
  const STORAGE_BEST = 'intruso.best';

  App.router.register('intruso', {
    title: 'Trova l’intruso',
    section: 'giochi',
    mount(root, ctx) {
      let best = Number(App.store.get(STORAGE_BEST, 0)) || 0;
      let state = 'start'; // start | playing | over
      let sets = [];
      let round = 0;
      let score = 0;
      let lives = MAX_LIVES;
      let startTime = 0;
      let locked = false;
      let roundToken = 0;
      let optionButtons = [];

      /* ---- HUD ---- */
      const roundStat = el('strong', { text: `1/${ROUNDS}` });
      const scoreStat = el('strong', { text: '0' });
      const livesStat = el('strong', { text: String(MAX_LIVES) });
      const timeStat = el('strong', { text: '00:00' });
      const barFill = el('span');
      const bar = el('div', { class: 'game-bar' }, barFill);
      const hud = el('div', { class: 'game-hud' }, [
        el('div', { class: 'hud-stats' }, [
          App.ui.hudStat(roundStat, 'domanda'),
          App.ui.hudStat(scoreStat, 'punti'),
          App.ui.hudStat(livesStat, 'vite'),
          App.ui.hudStat(timeStat, 'tempo')
        ])
      ]);

      /* ---- Gioco ---- */
      const question = el('h2', { class: 'intruso-question', text: 'Chi non c’entra?' });
      const optionsEl = el('div', { class: 'intruso-options', role: 'group', 'aria-label': 'Quattro possibilità' });
      const status = el('p', { class: 'game-status intruso-status', 'aria-live': 'polite' });
      const gameView = el('div', { class: 'intruso-layout' }, [hud, bar, question, optionsEl, status]);

      /* ---- Schermata iniziale ---- */
      const startBest = el('p', { class: 'hint', 'aria-live': 'polite' });
      const startView = el('div', { class: 'game-start' }, [
        el('div', { class: 'game-start__art', html: App.art.icons.star }),
        el('h2', { text: 'Quattro cose, una non c’entra' }),
        el('p', { class: 'hint', text: 'Leggi le quattro possibilità e tocca quella che non appartiene al gruppo. Hai dieci domande e tre vite.' }),
        startBest,
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
        title: 'Trova l’intruso',
        lead: 'In ogni gruppo c’è una cosa che non c’entra. Trovala, ascolta il perché e cerca di arrivare in fondo con tutte e tre le vite.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      const elapsedSeconds = () => (startTime ? Math.floor((performance.now() - startTime) / 1000) : 0);

      function paintHud() {
        roundStat.textContent = `${Math.min(round + 1, ROUNDS)}/${ROUNDS}`;
        scoreStat.textContent = String(score);
        livesStat.textContent = String(Math.max(0, lives));
        timeStat.textContent = App.util.clock(elapsedSeconds());
        barFill.style.width = `${(round / ROUNDS) * 100}%`;
      }

      function renderRound() {
        locked = false;
        const set = sets[round];
        const items = App.util.shuffle(set.items);
        optionsEl.replaceChildren();
        optionButtons = [];

        items.forEach((item) => {
          const button = el('button', {
            class: 'intruso-option',
            type: 'button',
            text: item
          });
          button.addEventListener('click', () => answer(item, button));
          optionsEl.append(button);
          optionButtons.push(button);
        });

        status.textContent = 'Tocca la cosa che non c’entra.';
        paintHud();
      }

      function answer(value, button) {
        if (state !== 'playing' || locked) return;
        locked = true;
        const set = sets[round];
        const correct = value === set.answer;

        optionButtons.forEach((optionButton) => {
          optionButton.disabled = true;
          if (optionButton.textContent === set.answer) optionButton.classList.add('is-correct');
        });

        if (correct) {
          score += 1;
          status.textContent = `Giusto! ${set.reason}`;
          App.sound.success();
        } else {
          lives -= 1;
          button.classList.add('is-wrong');
          status.textContent = `Non era quella. ${set.reason}`;
          App.sound.error();
        }
        paintHud();

        const token = roundToken;
        ctx.timeout(() => {
          if (token !== roundToken || state !== 'playing') return;
          if (lives <= 0) {
            endGame('lives');
            return;
          }
          round += 1;
          if (round >= ROUNDS) {
            endGame('done');
            return;
          }
          renderRound();
        }, correct ? 900 : 1600);
      }

      function startGame() {
        roundToken += 1;
        state = 'playing';
        sets = App.util.shuffle(App.data.oddOneOut).slice(0, ROUNDS);
        round = 0;
        score = 0;
        lives = MAX_LIVES;
        startTime = performance.now();
        barFill.style.width = '0%';
        barFill.style.background = 'var(--marigold)';
        stage.replaceChildren(gameView);
        renderRound();
        App.sound.click();
      }

      function endGame(reason) {
        if (state !== 'playing') return;
        state = 'over';
        roundToken += 1;
        const seconds = elapsedSeconds();
        const isRecord = score > best;
        if (isRecord) {
          best = score;
          App.store.set(STORAGE_BEST, best);
        }
        timeStat.textContent = App.util.clock(seconds);

        let title = 'Si può allenare l’occhio';
        if (reason === 'lives') title = 'Le vite sono finite';
        else if (score === ROUNDS) title = 'Perfetto, senza errori!';
        else if (score >= 8) title = 'Occhio fino!';
        else if (score >= 5) title = 'Buon lavoro!';

        const result = App.ui.resultPanel({
          title,
          message: isRecord
            ? 'Nuovo record! Il tuo occhio non si lascia ingannare.'
            : score >= 6
              ? App.util.pick(App.data.praises)
              : 'Ogni intruso trovato allena la logica. La prossima volta andrà meglio.',
          mood: score >= 6 ? 'win' : 'lose',
          stats: [
            { value: `${score}/${ROUNDS}`, label: 'Risposte giuste' },
            { value: String(Math.max(0, lives)), label: 'Vite rimaste' },
            { value: App.util.clock(seconds), label: 'Tempo' },
            { value: String(best), label: 'Record' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Rigioca',
              on: { click: startGame }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        });
        stage.replaceChildren(result);
        if (score >= 6) {
          App.sound.chime();
          App.ui.sparkles(result, 22);
        } else {
          App.sound.pop();
        }
        result.scrollIntoView({ behavior: App.util.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }

      function showStart() {
        state = 'start';
        startBest.textContent = best > 0
          ? `Il tuo record: ${best} risposte giuste su ${ROUNDS}.`
          : 'Il primo giro vale il record: prenditi il tuo tempo.';
        stage.replaceChildren(startView);
      }

      ctx.interval(() => {
        if (state === 'playing') timeStat.textContent = App.util.clock(elapsedSeconds());
      }, 250);

      ctx.on(window, 'keydown', (event) => {
        if (event.repeat || state !== 'playing' || locked) return;
        const number = Number(event.key);
        if (number >= 1 && number <= 4) {
          const button = optionButtons[number - 1];
          if (button) button.click();
        }
      });

      showStart();
    }
  });
})(window.App = window.App || {});
