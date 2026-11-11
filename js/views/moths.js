/* ============================================================
   falene.js — La casa delle falene.
   Nove finestre, trenta secondi e una sola regola:
   acchiappa le falene prima che volino via.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const DURATION = 30;
  const WINDOWS = 9;

  App.router.register('falene', {
    title: 'La casa delle falene',
    section: 'giochi',
    mount(root, ctx) {
      let state = 'start'; // start | playing | over
      let score = 0;
      let best = Number(App.store.get('moths.best', 0)) || 0;
      let endAt = 0;
      let spawnTimer = 0;

      /* ---- Statistiche in alto ---- */
      const scoreStat = el('strong', { text: '0' });
      const timeStat = el('strong', { text: App.util.clock(DURATION) });
      const bestStat = el('strong', { text: String(best) });

      const hud = el('div', { class: 'game-hud' }, [
        el('div', { class: 'hud-stats' }, [
          el('div', { class: 'hud-stat' }, [scoreStat, el('span', { text: 'prese' })]),
          el('div', { class: 'hud-stat' }, [timeStat, el('span', { text: 'tempo' })]),
          el('div', { class: 'hud-stat' }, [bestStat, el('span', { text: 'record' })])
        ])
      ]);

      /* ---- Le nove finestre della casa ---- */
      const windows = Array.from({ length: WINDOWS }, (_, index) => {
        const button = el('button', {
          class: 'window is-empty',
          type: 'button',
          disabled: true,
          'aria-label': `Finestra ${index + 1}, vuota`,
          dataset: { index: String(index) },
          on: { click: () => catchMoth(index) }
        });
        return button;
      });

      const house = el('div', {
        class: 'moth-house',
        role: 'group',
        'aria-label': 'La casa delle falene'
      }, windows);

      const status = el('p', { class: 'moth-status', 'aria-live': 'polite' });
      const gameView = el('div', { class: 'moth-layout' }, [house, status]);

      /* ---- Schermata iniziale ---- */
      const startView = el('div', { class: 'moth-start' }, [
        el('div', { class: 'moth-start__art', html: App.art.icons.moths }),
        el('h2', { text: 'La casa è piena di falene!' }),
        el('p', {
          class: 'hint',
          text: 'Hai trenta secondi per acchiapparle tutte. Tocca una finestra quando vedi una falena: se aspetti troppo, vola via.'
        }),
        el('button', {
          class: 'btn btn--primary btn--lg',
          type: 'button',
          text: 'Apri le finestre',
          on: { click: startGame }
        })
      ]);

      const stage = el('div', { class: 'stage' });
      const page = App.ui.page({
        kicker: 'Per giocare',
        title: 'La casa delle falene',
        lead: 'Le falene si nascondono dietro le finestre di una casa un po’ stregata. Acchiappale al volo: hai trenta secondi.',
        back: { href: 'giochi', label: 'Tutti i giochi' }
      });
      page.append(stage);
      root.append(page);

      function paintHud() {
        scoreStat.textContent = String(score);
        bestStat.textContent = String(best);
        timeStat.textContent = App.util.clock(Math.max(0, (endAt - performance.now()) / 1000));
      }

      function clearWindows() {
        windows.forEach((windowEl, index) => {
          windowEl.replaceChildren();
          windowEl.classList.remove('is-caught');
          windowEl.classList.add('is-empty');
          windowEl.disabled = true;
          windowEl.setAttribute('aria-label', `Finestra ${index + 1}, vuota`);
        });
      }

      function openWindow(index, duration) {
        const windowEl = windows[index];
        if (!windowEl || !windowEl.classList.contains('is-empty')) return;

        windowEl.classList.remove('is-empty');
        windowEl.disabled = false;
        windowEl.setAttribute('aria-label', `Finestra ${index + 1}, falena!`);
        windowEl.append(
          el('span', { class: 'window__moth', html: App.art.icons.moths })
        );

        // Dopo un po' la falena scappa, se nessuno l'ha presa.
        ctx.timeout(() => {
          if (state !== 'playing' || windowEl.classList.contains('is-caught')) return;
          windowEl.replaceChildren();
          windowEl.classList.add('is-empty');
          windowEl.disabled = true;
          windowEl.setAttribute('aria-label', `Finestra ${index + 1}, vuota`);
          App.sound.tick();
        }, duration);
      }

      function spawnMoth() {
        if (state !== 'playing') return;

        const free = windows
          .map((windowEl, index) => (windowEl.classList.contains('is-empty') ? index : -1))
          .filter((index) => index >= 0);

        if (free.length) {
          const elapsed = DURATION - Math.max(0, (endAt - performance.now()) / 1000);
          const visibleFor = Math.max(650, 1450 - elapsed * 18);
          openWindow(App.util.pick(free), visibleFor);
        }

        const elapsed = DURATION - Math.max(0, (endAt - performance.now()) / 1000);
        const nextSpawn = Math.max(260, 720 - elapsed * 9);
        spawnTimer = ctx.timeout(spawnMoth, nextSpawn);
      }

      function catchMoth(index) {
        if (state !== 'playing') return;
        const windowEl = windows[index];
        if (!windowEl || windowEl.classList.contains('is-empty') || windowEl.classList.contains('is-caught')) return;

        windowEl.classList.add('is-caught');
        windowEl.disabled = true;
        windowEl.setAttribute('aria-label', `Finestra ${index + 1}, falena presa`);
        score += 1;
        paintHud();
        App.sound.pop();
        App.sound.success();
        status.textContent = score === 1 ? 'Prima falena presa!' : `Falene prese: ${score}`;

        // La falena sparisce con la sua piccola animazione.
        ctx.timeout(() => {
          windowEl.replaceChildren();
          windowEl.classList.remove('is-caught');
          windowEl.classList.add('is-empty');
          windowEl.setAttribute('aria-label', `Finestra ${index + 1}, vuota`);
        }, 320);
      }

      function startGame() {
        state = 'playing';
        score = 0;
        endAt = performance.now() + DURATION * 1000;
        spawnTimer = 0;

        clearWindows();
        paintHud();
        stage.replaceChildren(hud, gameView);
        status.textContent = 'Tocca le finestre con le falene!';
        App.sound.click();

        // Le prime falene arrivano subito, poi il ritmo cresce.
        spawnTimer = ctx.timeout(spawnMoth, 350);
      }

      function endGame() {
        if (state !== 'playing') return;
        state = 'over';
        clearWindows();
        window.clearTimeout(spawnTimer);

        const isRecord = score > best;
        if (isRecord) {
          best = score;
          App.store.set('moths.best', best);
        }
        paintHud();
        App.sound.chime();
        if (score >= 5) App.ui.sparkles(stage, 26);

        let title = 'Le falene ti ringraziano';
        if (score >= 12) title = 'Campionessa delle falene!';
        else if (score >= 8) title = 'Che riflessi!';
        else if (score >= 4) title = 'Bella caccia!';

        const result = App.ui.resultPanel({
          title,
          message: isRecord
            ? 'Nuovo record! Le falene ne parlano ancora.'
            : score === 0
              ? 'Nessuna falena, questa volta. Riprova: sono dispettose ma non invisibili.'
              : App.util.pick(App.data.praises),
          stats: [
            { value: String(score), label: 'Falene prese' },
            { value: String(best), label: 'Record' },
            { value: App.util.clock(DURATION), label: 'Durata' }
          ],
          actions: [
            el('button', {
              class: 'btn btn--primary',
              type: 'button',
              text: 'Gioca ancora',
              on: { click: startGame }
            }),
            el('a', { class: 'btn btn--ghost', href: '#/giochi', text: 'Torna ai giochi' })
          ]
        });
        stage.replaceChildren(result);
        result.scrollIntoView({ behavior: App.util.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      }

      // Il cronometro aggiorna l'HUD e chiude la partita allo scadere.
      ctx.interval(() => {
        if (state !== 'playing') return;
        const remaining = Math.max(0, (endAt - performance.now()) / 1000);
        timeStat.textContent = App.util.clock(remaining);
        if (remaining <= 0) endGame();
      }, 100);

      paintHud();
      stage.replaceChildren(startView);
    }
  });
})(window.App = window.App || {});
