/* ============================================================
   campanelle.js — Simon con quattro campanelle.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const BELLS = [
    { name: 'Do', color: 'var(--coral)' },
    { name: 'Mi', color: 'var(--marigold)' },
    { name: 'Sol', color: 'var(--teal)' },
    { name: 'Do alto', color: 'var(--lavender)' }
  ];

  App.router.register('simon', {
    title: 'Le campanelle',
    section: 'giochi',
    mount(root, ctx) {
      let sequence = [];
      let phase = 'idle'; // idle | playing | input | over
      let inputIndex = 0;
      let level = 0;
      let roundToken = 0;
      let best = Number(App.store.get('simon.best', 0)) || 0;

      const levelStat = el('strong', { text: '0' });
      const bestStat = el('strong', { text: String(best) });
      const status = el('p', { class: 'simon-status', 'aria-live': 'polite' });
      const resultArea = el('div', { class: 'simon-result' });

      const bells = BELLS.map((bell, index) =>
        el('button', {
          class: 'bell',
          type: 'button',
          'aria-label': `Campanella ${bell.name}`,
          style: { '--bell': bell.color },
          disabled: true,
          on: { click: () => press(index) }
        }, el('span', { text: bell.name }))
      );

      const startButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Inizia',
        on: { click: startGame }
      });

      const hud = el('div', { class: 'game-hud' }, [
        el('div', { class: 'hud-stats' }, [
          el('div', { class: 'hud-stat' }, [levelStat, el('span', { text: 'livello' })]),
          el('div', { class: 'hud-stat' }, [bestStat, el('span', { text: 'record' })])
        ]),
        startButton
      ]);

      const stage = el('div', { class: 'stage' }, [
        hud,
        el('div', { class: 'simon-layout' }, [
          el('div', { class: 'simon-grid', role: 'group', 'aria-label': 'Quattro campanelle' }, bells),
          status,
          resultArea
        ])
      ]);

      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'Le campanelle',
        lead: 'Ascolta la melodia, poi ripetila. Ogni giro si allunga di una nota: fin dove arriva la tua memoria?',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function paintHud() {
        levelStat.textContent = String(level);
        bestStat.textContent = String(best);
      }

      function setBellsEnabled(enabled) {
        bells.forEach((bell) => {
          bell.disabled = !enabled;
        });
      }

      function clearLights() {
        bells.forEach((bell) => bell.classList.remove('is-lit'));
      }

      function light(index, duration = 320) {
        const bell = bells[index];
        bell.classList.add('is-lit');
        ctx.timeout(() => bell.classList.remove('is-lit'), duration);
      }

      function playback(token) {
        phase = 'playing';
        setBellsEnabled(false);
        status.textContent = 'Ascolta la melodia…';

        sequence.forEach((bellIndex, step) => {
          ctx.timeout(() => {
            if (token !== roundToken) return;
            light(bellIndex);
            App.sound.note(bellIndex);
          }, 320 + step * 560);
        });

        ctx.timeout(() => {
          if (token !== roundToken) return;
          phase = 'input';
          inputIndex = 0;
          setBellsEnabled(true);
          status.textContent = 'Tocca tu: ripeti la melodia.';
        }, 320 + sequence.length * 560 + 120);
      }

      function startGame() {
        roundToken += 1;
        const token = roundToken;
        clearLights();
        resultArea.replaceChildren();
        sequence = [App.util.randInt(BELLS.length)];
        level = 1;
        inputIndex = 0;
        paintHud();
        startButton.textContent = 'Ricomincia';
        App.sound.click();
        playback(token);
      }

      function press(index) {
        if (phase !== 'input') return;
        light(index, 260);
        App.sound.note(index);

        if (sequence[inputIndex] !== index) {
          gameOver();
          return;
        }

        inputIndex += 1;
        if (inputIndex < sequence.length) return;

        phase = 'waiting';
        setBellsEnabled(false);
        status.textContent = 'Bene! Ancora una nota…';
        const token = roundToken;
        ctx.timeout(() => {
          if (token !== roundToken) return;
          sequence.push(App.util.randInt(BELLS.length));
          level += 1;
          paintHud();
          App.sound.pop();
          playback(token);
        }, 750);
      }

      function gameOver() {
        phase = 'over';
        setBellsEnabled(false);
        if (level > best) {
          best = level;
          App.store.set('simon.best', best);
          paintHud();
        }
        status.textContent = 'La melodia si è fermata.';
        App.sound.error();

        const result = App.ui.resultPanel({
          title: 'La melodia si è fermata',
          message: 'Le campanelle si sono divertite. Vuoi provare ad arrivare un po’ più in là?',
          mood: 'lose',
          stats: [
            { value: String(level), label: 'Livello' },
            { value: String(best), label: 'Record' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Riprova',
              on: { click: startGame }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        });
        resultArea.replaceChildren(result);
      }

      ctx.on(window, 'keydown', (event) => {
        const number = Number(event.key);
        if (number >= 1 && number <= 4 && phase === 'input') {
          const bell = bells[number - 1];
          if (bell && !bell.disabled) bell.click();
        }
      });

      status.textContent = 'Premi “Inizia” per ascoltare la melodia.';
      paintHud();
    }
  });
})(window.App = window.App || {});
