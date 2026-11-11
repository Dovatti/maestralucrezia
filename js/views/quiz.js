/* ============================================================
   quiz.js — Quiz lampo di matematica.
   Dieci domande, sessanta secondi, quattro risposte.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;
  const { randInt, shuffle, pick, clock } = App.util;

  const TOTAL_QUESTIONS = 10;
  const DURATION = 60;

  const LEVELS = [
    { id: 'facile', label: 'Facile', description: 'Somme e sottrazioni entro il 10.' },
    { id: 'medio', label: 'Medio', description: 'Numeri entro il 20 e tabelline fino a 5.' },
    { id: 'difficile', label: 'Difficile', description: 'Tabelline fino a 10, divisioni e numeri più grandi.' }
  ];

  function buildQuestion(level) {
    let a;
    let b;
    let answer;
    let symbol;

    if (level === 'facile') {
      if (randInt(2) === 0) {
        a = randInt(8) + 1;
        b = randInt(10 - a) + 1;
        symbol = '+';
        answer = a + b;
      } else {
        a = randInt(9) + 2;
        b = randInt(a) + 1;
        symbol = '−';
        answer = a - b;
      }
    } else if (level === 'medio') {
      const kind = randInt(3);
      if (kind === 0) {
        a = randInt(15) + 1;
        b = randInt(Math.max(1, 20 - a)) + 1;
        symbol = '+';
        answer = a + b;
      } else if (kind === 1) {
        a = randInt(16) + 5;
        b = randInt(a) + 1;
        symbol = '−';
        answer = a - b;
      } else {
        a = randInt(4) + 2;
        b = randInt(9) + 1;
        symbol = '×';
        answer = a * b;
      }
    } else {
      const kind = randInt(4);
      if (kind === 0) {
        a = randInt(9) + 2;
        b = randInt(9) + 2;
        symbol = '×';
        answer = a * b;
      } else if (kind === 1) {
        b = randInt(8) + 2;
        answer = randInt(9) + 2;
        a = b * answer;
        symbol = '÷';
      } else if (kind === 2) {
        a = randInt(40) + 10;
        b = randInt(40) + 10;
        symbol = '+';
        answer = a + b;
      } else {
        a = randInt(80) + 20;
        b = randInt(a) + 1;
        symbol = '−';
        answer = a - b;
      }
    }

    return { text: `${a} ${symbol} ${b} = ?`, answer, options: makeOptions(answer) };
  }

  function makeOptions(answer) {
    const options = new Set([answer]);
    const spread = Math.max(3, Math.round(Math.abs(answer) * 0.25));
    let guard = 0;
    while (options.size < 4 && guard < 80) {
      guard += 1;
      let candidate = answer + randInt(spread * 2 + 1) - spread;
      if (candidate < 0) candidate = Math.abs(candidate);
      if (candidate !== answer) options.add(candidate);
    }
    let extra = 1;
    while (options.size < 4) {
      options.add(answer + extra);
      extra += 1;
    }
    return shuffle([...options]);
  }

  App.router.register('quiz', {
    title: 'Quiz lampo',
    section: 'giochi',
    mount(root, ctx) {
      let level = App.store.get('quiz.level', 'medio');
      if (!LEVELS.some((item) => item.id === level)) level = 'medio';

      let state = 'start';
      let index = 0;
      let score = 0;
      let answered = 0;
      let streak = 0;
      let locked = false;
      let currentQuestion = null;
      let endAt = 0;

      /* ---- Schermata iniziale ---- */
      const levelHint = el('p', { class: 'hint', 'aria-live': 'polite' });
      const levelButtons = LEVELS.map((item) =>
        el('button', {
          class: 'chip',
          type: 'button',
          'aria-pressed': String(item.id === level),
          dataset: { level: item.id },
          text: item.label,
          on: { click: () => selectLevel(item.id) }
        })
      );
      const startButton = el('button', {
        class: 'btn btn--primary btn--lg',
        type: 'button',
        text: 'Inizia il quiz',
        on: { click: () => startGame() }
      });
      const startView = el('div', { class: 'quiz-start' }, [
        el('div', { class: 'quiz-start__moon', html: App.art.icons.moon }),
        el('h2', { text: 'Quanti ne sai?' }),
        el('p', { class: 'hint', text: '10 domande · 60 secondi · 4 risposte. Scegli il livello e via!' }),
        el('div', { class: 'timer-presets', role: 'group', 'aria-label': 'Livello di difficoltà' }, levelButtons),
        levelHint,
        startButton
      ]);

      /* ---- Partita ---- */
      const questionCounter = el('span', { class: 'counter' });
      const scoreCounter = el('span', { class: 'counter' });
      const timeCounter = el('span', { class: 'counter' });
      const barFill = el('span');
      const bar = el('div', { class: 'quiz-bar' }, barFill);
      const questionEl = el('h2', { class: 'quiz-question', 'aria-live': 'polite' });
      const optionsEl = el('div', { class: 'quiz-options' });
      const feedback = el('p', { class: 'quiz-feedback', 'aria-live': 'polite' });

      const gameView = el('div', { class: 'quiz-layout' }, [
        el('div', { class: 'quiz-top' }, [
          el('div', { class: 'tool-bar__group' }, [questionCounter, scoreCounter]),
          timeCounter
        ]),
        bar,
        questionEl,
        optionsEl,
        feedback
      ]);

      const stage = el('div', { class: 'stage' });
      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'Quiz lampo',
        lead: 'Dieci domande di matematica, sessanta secondi e quattro risposte. Più veloce di un pensiero, più gentile di un’interrogazione.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function selectLevel(nextLevel) {
        level = nextLevel;
        App.store.set('quiz.level', level);
        levelButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(button.dataset.level === level));
        });
        paintLevelHint();
        App.sound.click();
      }

      function paintLevelHint() {
        const item = LEVELS.find((entry) => entry.id === level);
        levelHint.textContent = item ? item.description : '';
      }

      function paintHud() {
        questionCounter.textContent = `Domanda ${Math.min(index + 1, TOTAL_QUESTIONS)} di ${TOTAL_QUESTIONS}`;
        scoreCounter.textContent = `Punti ${score}`;
        timeCounter.textContent = clock(Math.max(0, (endAt - performance.now()) / 1000));
      }

      function renderQuestion() {
        currentQuestion = buildQuestion(level);
        questionEl.textContent = currentQuestion.text;
        feedback.textContent = '';
        optionsEl.replaceChildren();

        currentQuestion.options.forEach((option) => {
          const button = el('button', {
            class: 'quiz-option',
            type: 'button',
            text: String(option)
          });
          button.addEventListener('click', () => answer(option, button));
          optionsEl.append(button);
        });

        paintHud();
      }

      function answer(value, button) {
        if (state !== 'playing' || locked) return;
        locked = true;
        answered += 1;
        const correct = value === currentQuestion.answer;
        optionsEl.querySelectorAll('button').forEach((optionButton) => {
          optionButton.disabled = true;
          if (Number(optionButton.textContent) === currentQuestion.answer) {
            optionButton.classList.add('is-correct');
          }
        });

        if (correct) {
          score += 1;
          streak += 1;
          button.classList.add('is-correct');
          feedback.textContent = streak > 1 ? `Giusto! Serie di ${streak}.` : 'Giusto!';
          App.sound.success();
        } else {
          button.classList.add('is-wrong');
          feedback.textContent = `Quasi! La risposta era ${currentQuestion.answer}.`;
          streak = 0;
          App.sound.error();
        }
        paintHud();

        ctx.timeout(() => {
          if (state !== 'playing') return;
          locked = false;
          index += 1;
          if (index >= TOTAL_QUESTIONS) {
            endGame('done');
          } else {
            renderQuestion();
          }
        }, correct ? 650 : 1050);
      }

      function startGame() {
        state = 'playing';
        index = 0;
        score = 0;
        answered = 0;
        streak = 0;
        locked = false;
        endAt = performance.now() + DURATION * 1000;
        barFill.style.width = '100%';
        barFill.style.background = 'var(--teal)';
        stage.replaceChildren(gameView);
        renderQuestion();
        App.sound.click();
      }

      function endGame(reason) {
        if (state !== 'playing') return;
        state = 'end';
        const remaining = Math.max(0, (endAt - performance.now()) / 1000);
        const timeUsed = reason === 'time' ? DURATION : Math.max(0, DURATION - remaining);
        barFill.style.width = `${(remaining / DURATION) * 100}%`;

        let title = 'Quiz completato';
        if (score >= 9) title = 'Fuochi d’artificio!';
        else if (score >= 7) title = 'Che brava!';
        else if (score >= 4) title = 'Buon lavoro!';
        else title = 'Si può sempre migliorare';

        const result = App.ui.resultPanel({
          title,
          message: reason === 'time'
            ? 'Il tempo è volato via. Riprova: la prossima volta corri più veloce del timer.'
            : pick(App.data.praises),
          stats: [
            { value: `${score}/${TOTAL_QUESTIONS}`, label: 'Risposte giuste' },
            { value: String(answered), label: 'Domande viste' },
            { value: clock(timeUsed), label: 'Tempo' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Rigioca',
              on: { click: () => startGame() }
            }),
            el('button', {
              class: 'btn btn--ghost',
              type: 'button',
              text: 'Cambia livello',
              on: { click: showStart }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        });
        stage.replaceChildren(result);
        if (score >= 7) {
          App.sound.chime();
          App.ui.sparkles(result, 22);
        } else {
          App.sound.pop();
        }
      }

      function showStart() {
        state = 'start';
        paintLevelHint();
        stage.replaceChildren(startView);
      }

      ctx.interval(() => {
        if (state !== 'playing') return;
        const remaining = Math.max(0, (endAt - performance.now()) / 1000);
        timeCounter.textContent = clock(remaining);
        barFill.style.width = `${(remaining / DURATION) * 100}%`;
        barFill.style.background = remaining <= 10 ? 'var(--coral)' : 'var(--teal)';
        if (remaining <= 0) endGame('time');
      }, 100);

      ctx.on(window, 'keydown', (event) => {
        if (state !== 'playing' || locked) return;
        const number = Number(event.key);
        if (number >= 1 && number <= 4) {
          const button = optionsEl.querySelectorAll('button')[number - 1];
          if (button) button.click();
        }
      });

      paintLevelHint();
      showStart();
    }
  });
})(window.App = window.App || {});
