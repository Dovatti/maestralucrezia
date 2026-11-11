/* ============================================================
   tris.js — Tris delle falene, con una piccola IA imbattibile
   (quando ne ha voglia).
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const MARKS = {
    X: { name: 'falena', icon: App.art.icons.moths },
    O: { name: 'chiave', icon: App.art.icons.key }
  };

  function getWinner(board) {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { mark: board[a], line };
      }
    }
    return null;
  }

  function emptyCells(board) {
    return board.reduce((cells, mark, index) => {
      if (!mark) cells.push(index);
      return cells;
    }, []);
  }

  /** Minimax: l'IA gioca con la chiave (O). */
  function minimax(board, player) {
    const win = getWinner(board);
    if (win) return win.mark === 'O' ? 10 : -10;
    const cells = emptyCells(board);
    if (!cells.length) return 0;

    if (player === 'O') {
      let best = -Infinity;
      for (const index of cells) {
        board[index] = 'O';
        best = Math.max(best, minimax(board, 'X'));
        board[index] = null;
      }
      return best;
    }

    let best = Infinity;
    for (const index of cells) {
      board[index] = 'X';
      best = Math.min(best, minimax(board, 'O'));
      board[index] = null;
    }
    return best;
  }

  function bestMoves(board) {
    let best = -Infinity;
    let moves = [];
    for (const index of emptyCells(board)) {
      board[index] = 'O';
      const score = minimax(board, 'X');
      board[index] = null;
      if (score > best) {
        best = score;
        moves = [index];
      } else if (score === best) {
        moves.push(index);
      }
    }
    return moves;
  }

  App.router.register('tris', {
    title: 'Tris delle falene',
    section: 'giochi',
    mount(root, ctx) {
      let board = Array(9).fill(null);
      let current = 'X';
      let over = false;
      let aiThinking = false;
      let roundToken = 0;
      let mode = App.store.get('tris.mode', '1p') === '2p' ? '2p' : '1p';
      let difficulty = App.store.get('tris.difficulty', 'furba') === 'gentile' ? 'gentile' : 'furba';
      let score = { X: 0, O: 0, draw: 0 };

      const status = el('p', { class: 'tris-status', 'aria-live': 'polite' });
      const scoreX = el('strong', { text: '0' });
      const scoreO = el('strong', { text: '0' });
      const scoreDraw = el('strong', { text: '0' });

      const cells = Array.from({ length: 9 }, (_, index) =>
        el('button', {
          class: 'tris-cell',
          type: 'button',
          'aria-label': `Cella ${index + 1}, vuota`,
          on: { click: () => play(index) }
        })
      );

      const boardEl = el('div', { class: 'tris-board', role: 'group', 'aria-label': 'Griglia del tris' }, cells);

      const modeButtons = [
        { value: '1p', label: 'Contro la chiave' },
        { value: '2p', label: 'Due giocatori' }
      ].map((option) =>
        el('button', {
          type: 'button',
          'aria-pressed': String(mode === option.value),
          text: option.label,
          dataset: { mode: option.value },
          on: { click: () => setMode(option.value) }
        })
      );

      const difficultyButtons = [
        { value: 'gentile', label: 'Gentile' },
        { value: 'furba', label: 'Furba' }
      ].map((option) =>
        el('button', {
          type: 'button',
          'aria-pressed': String(difficulty === option.value),
          text: option.label,
          dataset: { difficulty: option.value },
          on: { click: () => setDifficulty(option.value) }
        })
      );
      const difficultyGroup = el('div', { class: 'segmented', role: 'group', 'aria-label': 'Difficoltà' }, difficultyButtons);

      const restartButton = el('button', {
        class: 'btn btn--primary',
        type: 'button',
        html: `<span class="btn__icon">${App.art.ui.restart}</span><span>Nuova partita</span>`,
        on: { click: restart }
      });

      const panel = el('div', { class: 'tris-panel' }, [
        status,
        el('div', { class: 'tris-score' }, [
          el('div', { class: 'hud-stat' }, [scoreX, el('span', { text: 'falena' })]),
          el('div', { class: 'hud-stat' }, [scoreO, el('span', { text: 'chiave' })]),
          el('div', { class: 'hud-stat' }, [scoreDraw, el('span', { text: 'pari' })])
        ]),
        el('div', { class: 'segmented', role: 'group', 'aria-label': 'Modalità' }, modeButtons),
        difficultyGroup,
        restartButton,
        el('p', { class: 'hint', text: 'La falena gioca per prima. Tre simboli in fila e la partita è vinta.' })
      ]);

      const stage = el('div', { class: 'stage' },
        el('div', { class: 'tris-layout' }, [boardEl, panel])
      );
      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'Tris delle falene',
        lead: 'Tre in fila, ma con una falena e una chiave. Gioca contro la chiave o sfida un compagno.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function paintScores() {
        scoreX.textContent = String(score.X);
        scoreO.textContent = String(score.O);
        scoreDraw.textContent = String(score.draw);
      }

      function paintControls() {
        modeButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
        });
        difficultyButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(button.dataset.difficulty === difficulty));
        });
        difficultyGroup.hidden = mode !== '1p';
      }

      function setMode(value) {
        mode = value;
        App.store.set('tris.mode', mode);
        score = { X: 0, O: 0, draw: 0 };
        paintScores();
        paintControls();
        restart();
        App.sound.click();
      }

      function setDifficulty(value) {
        difficulty = value;
        App.store.set('tris.difficulty', difficulty);
        paintControls();
        restart();
        App.sound.click();
      }

      function paintStatus() {
        if (over) return;
        if (aiThinking) {
          status.textContent = 'La chiave sta pensando…';
          return;
        }
        if (mode === '2p') {
          status.textContent = `Tocca alla ${MARKS[current].name}.`;
        } else {
          status.textContent = current === 'X' ? 'Tocca a te: falena.' : 'Tocca alla chiave.';
        }
      }

      function paintCell(index) {
        const mark = board[index];
        const cell = cells[index];
        if (mark) {
          cell.innerHTML = MARKS[mark].icon;
          cell.setAttribute('aria-label', `Cella ${index + 1}: ${MARKS[mark].name}`);
        } else {
          cell.innerHTML = '';
          cell.setAttribute('aria-label', `Cella ${index + 1}, vuota`);
        }
      }

      function play(index) {
        if (over || board[index]) return;
        if (mode === '1p' && (current === 'O' || aiThinking)) return;
        place(index, current);
      }

      function place(index, mark) {
        board[index] = mark;
        paintCell(index);
        App.sound.click();
        const win = getWinner(board);
        if (win) {
          finish(win);
          return;
        }
        if (!emptyCells(board).length) {
          finish(null);
          return;
        }
        current = mark === 'X' ? 'O' : 'X';
        paintStatus();
        if (mode === '1p' && current === 'O') scheduleAi();
      }

      function scheduleAi() {
        aiThinking = true;
        paintStatus();
        const token = roundToken;
        ctx.timeout(() => {
          if (token !== roundToken || over || mode !== '1p' || current !== 'O') return;
          aiThinking = false;
          const options = emptyCells(board);
          if (!options.length) return;
          const move = difficulty === 'gentile' && App.util.randInt(100) < 65
            ? App.util.pick(options)
            : App.util.pick(bestMoves(board));
          place(move, 'O');
        }, 430);
      }

      function finish(win) {
        over = true;
        aiThinking = false;
        if (win) {
          win.line.forEach((index) => cells[index].classList.add('is-win'));
          score[win.mark] += 1;
          App.sound.success();
          App.ui.sparkles(boardEl, 18);
          if (mode === '1p') {
            status.textContent = win.mark === 'X'
              ? 'Hai vinto! La falena fa tre in fila.'
              : 'La chiave ha vinto. Riprova!';
          } else {
            status.textContent = `Vince la ${MARKS[win.mark].name}!`;
          }
        } else {
          score.draw += 1;
          status.textContent = 'Pareggio perfetto: nessuno vince.';
          App.sound.pop();
        }
        paintScores();
      }

      function restart() {
        roundToken += 1;
        board = Array(9).fill(null);
        current = 'X';
        over = false;
        aiThinking = false;
        cells.forEach((cell, index) => {
          cell.classList.remove('is-win');
          cell.disabled = false;
          paintCell(index);
        });
        paintStatus();
        App.sound.click();
      }

      paintControls();
      paintScores();
      restart();
    }
  });
})(window.App = window.App || {});
