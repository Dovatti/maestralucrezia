/* ============================================================
   lavagna.js — Lavagna magica su canvas.
   Disegno con mouse/dito, gomma, annulla, esporta PNG.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  const COLORS = [
    { name: 'Inchiostro', value: '#2a1b35' },
    { name: 'Corallo', value: '#e8605f' },
    { name: 'Verde', value: '#2c8d80' },
    { name: 'Prugna', value: '#6b3f8c' },
    { name: 'Miele', value: '#f2b544' },
    { name: 'Rosa', value: '#e98fb0' }
  ];

  const SIZES = [
    { name: 'Sottile', value: 4, dot: '4px' },
    { name: 'Media', value: 9, dot: '9px' },
    { name: 'Grossa', value: 17, dot: '15px' }
  ];

  const ERASER_SIZE = 26;
  const REFERENCE_SIZE = 700; // Le misure dei tratti sono proporzionali a questa dimensione.

  App.router.register('lavagna', {
    title: 'Lavagna magica',
    section: 'strumenti',
    mount(root, ctx) {
      let color = COLORS[0].value;
      let size = SIZES[1].value;
      let erasing = false;
      let strokes = [];
      let currentStroke = null;
      let lastPoint = null;
      let resizeFrame = 0;

      const canvas = el('canvas', { 'aria-label': 'Lavagna per disegnare' });
      const frame = el('div', { class: 'board-frame' }, canvas);
      const context = canvas.getContext('2d');

      /* ---- Palette e misure ---- */
      const swatches = COLORS.map((item, index) =>
        el('button', {
          class: 'swatch',
          type: 'button',
          title: item.name,
          'aria-label': `Colore ${item.name}`,
          'aria-pressed': String(index === 0),
          style: { '--swatch': item.value },
          dataset: { color: item.value },
          on: {
            click: () => {
              color = item.value;
              setErasing(false);
              paintSwatches();
              App.sound.click();
            }
          }
        })
      );

      const sizeButtons = SIZES.map((item, index) =>
        el('button', {
          class: 'size-dot',
          type: 'button',
          title: item.name,
          'aria-label': `Tratto ${item.name.toLowerCase()}`,
          'aria-pressed': String(index === 1),
          style: { '--dot': item.dot },
          dataset: { size: String(item.value) },
          on: {
            click: () => {
              size = item.value;
              setErasing(false);
              paintSizes();
              App.sound.click();
            }
          }
        }, el('span', { 'aria-hidden': 'true' }))
      );

      const eraserButton = el('button', {
        class: 'chip',
        type: 'button',
        'aria-pressed': 'false',
        on: { click: () => setErasing(!erasing) }
      }, [
        el('span', { class: 'btn__icon', html: App.art.ui.close }),
        el('span', { text: 'Gomma' })
      ]);

      const undoButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        html: `<span class="btn__icon">${App.art.ui.undo}</span><span>Annulla</span>`,
        disabled: true,
        on: { click: undo }
      });
      const clearButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        html: `<span class="btn__icon">${App.art.ui.trash}</span><span>Svuota</span>`,
        on: { click: clear }
      });
      const saveButton = el('button', {
        class: 'btn btn--primary btn--sm',
        type: 'button',
        html: `<span class="btn__icon">${App.art.ui.download}</span><span>Salva PNG</span>`,
        on: { click: save }
      });
      const fullscreenLabel = el('span', { text: 'Schermo intero' });
      const fullscreenButton = el('button', {
        class: 'btn btn--ghost btn--sm',
        type: 'button',
        on: { click: () => App.ui.toggleFullscreen(layout) }
      }, [
        el('span', { class: 'btn__icon', html: App.art.ui.expand }),
        fullscreenLabel
      ]);

      const toolbar = el('div', { class: 'board-toolbar' }, [
        el('div', { class: 'tool-bar__group' }, [
          el('div', { class: 'swatches', role: 'group', 'aria-label': 'Colori' }, swatches),
          el('div', { class: 'tool-bar__group', role: 'group', 'aria-label': 'Spessore del tratto' }, sizeButtons),
          eraserButton
        ]),
        el('div', { class: 'tool-bar__group' }, [undoButton, clearButton, saveButton, fullscreenButton])
      ]);

      const layout = el('div', { class: 'board-layout' }, [toolbar, frame]);
      const stage = el('div', { class: 'stage' }, layout);
      const page = App.ui.page({
        kicker: 'Per la maestra',
        title: 'Lavagna magica',
        lead: 'Uno spazio bianco per spiegare, disegnare o fare due scarabocchi. Poi salvi tutto in un’immagine.',
        back: { href: 'strumenti', label: 'Tutti gli strumenti' }
      });
      page.append(
        stage,
        el('p', { class: 'hint', style: { 'margin-top': '0.8rem' }, text: 'Funziona con mouse, dito o penna. Su LIM e tablet il disegno segue il tocco.' })
      );
      root.append(page);

      /* ---- Stato visivo ---- */
      function paintSwatches() {
        swatches.forEach((button) => {
          button.setAttribute('aria-pressed', String(!erasing && button.dataset.color === color));
        });
      }

      function paintSizes() {
        sizeButtons.forEach((button) => {
          button.setAttribute('aria-pressed', String(Number(button.dataset.size) === size));
        });
      }

      function setErasing(value) {
        erasing = value;
        eraserButton.setAttribute('aria-pressed', String(erasing));
        paintSwatches();
        paintSizes();
      }

      function updateUndo() {
        undoButton.disabled = strokes.length === 0;
      }

      /* ---- Disegno ---- */
      function pointFromEvent(event) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height
        };
      }

      function styleContext(stroke) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const unit = Math.min(width, height);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = (stroke.size / REFERENCE_SIZE) * unit;
        context.strokeStyle = stroke.color;
        context.fillStyle = stroke.color;
        context.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over';
      }

      function drawPoint(stroke, point) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        styleContext(stroke);
        context.beginPath();
        context.arc(point.x * width, point.y * height, context.lineWidth / 2, 0, Math.PI * 2);
        context.fill();
        context.globalCompositeOperation = 'source-over';
      }

      function drawSegment(stroke, from, to) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        styleContext(stroke);
        context.beginPath();
        context.moveTo(from.x * width, from.y * height);
        context.lineTo(to.x * width, to.y * height);
        context.stroke();
        context.globalCompositeOperation = 'source-over';
      }

      function redraw() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        context.clearRect(0, 0, width, height);
        strokes.forEach((stroke) => {
          if (stroke.points.length === 1) drawPoint(stroke, stroke.points[0]);
          for (let index = 1; index < stroke.points.length; index += 1) {
            drawSegment(stroke, stroke.points[index - 1], stroke.points[index]);
          }
        });
      }

      function resize() {
        if (!context) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(frame.clientWidth * ratio));
        const height = Math.max(1, Math.round(frame.clientHeight * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        redraw();
      }

      canvas.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        const point = pointFromEvent(event);
        currentStroke = {
          color,
          size: erasing ? ERASER_SIZE : size,
          erase: erasing,
          points: [point]
        };
        lastPoint = point;
        strokes.push(currentStroke);
        drawPoint(currentStroke, point);
        updateUndo();
        App.sound.tick();
      });

      canvas.addEventListener('pointermove', (event) => {
        if (!currentStroke) return;
        event.preventDefault();
        const point = pointFromEvent(event);
        const dx = (point.x - lastPoint.x) * canvas.clientWidth;
        const dy = (point.y - lastPoint.y) * canvas.clientHeight;
        if (dx * dx + dy * dy < 1.2) return;
        currentStroke.points.push(point);
        drawSegment(currentStroke, lastPoint, point);
        lastPoint = point;
      });

      function endStroke(event) {
        if (!currentStroke) return;
        if (event && canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }
        currentStroke = null;
        lastPoint = null;
      }

      canvas.addEventListener('pointerup', endStroke);
      canvas.addEventListener('pointercancel', endStroke);
      canvas.addEventListener('pointerleave', (event) => {
        // Con il mouse, uscire dal bordo chiude il tratto.
        if (event.pointerType === 'mouse') endStroke(event);
      });

      /* ---- Azioni ---- */
      function undo() {
        if (!strokes.length) return;
        strokes.pop();
        redraw();
        updateUndo();
        App.sound.click();
      }

      async function clear() {
        if (!strokes.length) return;
        const confirmed = await App.ui.confirm({
          title: 'Svuotiamo la lavagna?',
          message: 'Il disegno sparirà per sempre. Se vuoi conservarlo, prima salvalo come PNG.',
          confirmLabel: 'Sì, svuota',
          danger: true
        });
        if (!confirmed) return;
        strokes = [];
        redraw();
        updateUndo();
        App.sound.pop();
        App.ui.toast('Lavagna pulita.');
      }

      function save() {
        if (!strokes.length) {
          App.ui.toast('La lavagna è ancora vuota: disegna qualcosa!', 'error');
          return;
        }
        App.ui.downloadCanvas(canvas, 'lavagna.png');
        App.sound.success();
        App.ui.toast('Immagine salvata.');
      }

      ctx.on(document, 'fullscreenchange', () => {
        fullscreenLabel.textContent = document.fullscreenElement ? 'Esci' : 'Schermo intero';
        window.setTimeout(resize, 60);
      });

      ctx.on(window, 'keydown', (event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
          event.preventDefault();
          undo();
        }
      });

      const observer = new ResizeObserver(() => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(resize);
      });
      observer.observe(frame);

      // Il canvas è appena stato inserito: aspetta un frame per misurarlo.
      window.requestAnimationFrame(resize);
      paintSwatches();
      paintSizes();

      return () => {
        observer.disconnect();
        window.cancelAnimationFrame(resizeFrame);
      };
    }
  });
})(window.App = window.App || {});
