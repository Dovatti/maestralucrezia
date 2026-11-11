/* ============================================================
   core.js — Il piccolo motore condiviso da tutto il sito:
   DOM, numeri casuali, memoria locale, suoni e componenti UI.
   Ogni pezzo è indipendente e senza dipendenze esterne.
   ============================================================ */
(function (App) {
  'use strict';

  /* ------------------------------------------------------------
     DOM: funzioni minime per costruire interfacce senza stringhe
     HTML (tranne le illustrazioni, che sono fidate e già pronte).
     ------------------------------------------------------------ */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function append(node, children) {
    if (children == null) return node;
    const list = Array.isArray(children) ? children.flat(Infinity) : [children];
    for (const child of list) {
      if (child == null || child === false) continue;
      node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  /**
   * el('button', { class: 'btn', on: { click: fn } }, ['Ciao'])
   * Proprietà speciali: class, text, html, dataset, style, on.
   */
  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (value == null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'html') node.innerHTML = value;
        else if (key === 'dataset') Object.assign(node.dataset, value);
        else if (key === 'style') {
          for (const [property, setting] of Object.entries(value)) {
            if (property.startsWith('--')) node.style.setProperty(property, setting);
            else node.style[property] = setting;
          }
        }
        else if (key === 'on') {
          for (const [event, handler] of Object.entries(value)) node.addEventListener(event, handler);
        } else if (key in node) {
          node[key] = value;
        } else {
          node.setAttribute(key, value === true ? '' : value);
        }
      }
    }
    return append(node, children);
  }

  /** Aggiunge un listener e restituisce la funzione per rimuoverlo. */
  function on(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    return () => target.removeEventListener(type, handler, options);
  }

  /* ------------------------------------------------------------
     Utility: tempo, numeri, casualità equa.
     ------------------------------------------------------------ */
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  /** Secondi interi → "mm:ss". */
  function clock(totalSeconds) {
    const seconds = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  /** Intero casuale in [0, max). Usa crypto quando disponibile. */
  function randInt(max) {
    if (max <= 0) return 0;
    if (window.crypto && window.crypto.getRandomValues) {
      const limit = Math.floor(0xffffffff / max) * max;
      const buffer = new Uint32Array(1);
      let value;
      do {
        window.crypto.getRandomValues(buffer);
        value = buffer[0];
      } while (value >= limit);
      return value % max;
    }
    return Math.floor(Math.random() * max);
  }

  function shuffle(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = randInt(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const pick = (array) => array[randInt(array.length)];

  /** Divide una lista in n gruppi il più possibile equilibrati. */
  function splitIntoGroups(items, count) {
    const groups = Array.from({ length: count }, () => []);
    shuffle(items).forEach((item, index) => groups[index % count].push(item));
    return groups;
  }

  /* ------------------------------------------------------------
     Memoria locale: i nomi della classe restano sul dispositivo.
     ------------------------------------------------------------ */
  const PREFIX = 'lucrezia.';

  const store = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (error) {
        /* Modalità privata o spazio pieno: il sito continua a funzionare. */
      }
    }
  };

  /* ------------------------------------------------------------
     Suoni: sintetizzati al volo con la Web Audio API.
     Nessun file audio da scaricare.
     ------------------------------------------------------------ */
  let audioContext = null;
  let muted = Boolean(store.get('muted', false));

  function audio() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return audioContext;
  }

  /**
   * Una nota con inviluppo morbido.
   * @param {number} frequency Hz
   * @param {number} duration secondi
   * @param {{type?: string, volume?: number, delay?: number, slideTo?: number}} options
   */
  function tone(frequency, duration = 0.14, options = {}) {
    if (muted) return;
    const context = audio();
    if (!context) return;
    const { type = 'sine', volume = 0.06, delay = 0, slideTo = null } = options;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  const sounds = {
    click: () => tone(640, 0.055, { type: 'triangle', volume: 0.045 }),
    pop: () => tone(420, 0.13, { type: 'sine', volume: 0.07, slideTo: 760 }),
    flip: () => tone(300, 0.07, { type: 'triangle', volume: 0.04, slideTo: 430 }),
    tick: () => tone(980, 0.03, { type: 'square', volume: 0.02 }),
    success: () => {
      [523.25, 659.25, 783.99].forEach((note, i) => tone(note, 0.18, { delay: i * 0.09, volume: 0.055 }));
    },
    error: () => {
      tone(300, 0.16, { type: 'triangle', volume: 0.05 });
      tone(220, 0.22, { type: 'triangle', volume: 0.05, delay: 0.13 });
    },
    chime: () => {
      [783.99, 1046.5, 1318.5, 1046.5].forEach((note, i) => tone(note, 0.4, { delay: i * 0.16, volume: 0.05 }));
    },
    note: (index) => {
      const notes = [261.63, 329.63, 392.0, 523.25];
      tone(notes[index % notes.length], 0.35, { type: 'sine', volume: 0.09 });
    }
  };

  const sound = {
    ...sounds,
    isMuted: () => muted,
    setMuted(value) {
      muted = Boolean(value);
      store.set('muted', muted);
      return muted;
    },
    toggle() {
      return sound.setMuted(!muted);
    },
    /** Da chiamare su un gesto dell'utente per sbloccare l'audio su iOS. */
    unlock() {
      if (!muted) audio();
    }
  };

  /* ------------------------------------------------------------
     UI condivisa: toast, scintille, dialoghi, testata di pagina.
     ------------------------------------------------------------ */
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(message, variant = 'default') {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const node = el('div', { class: `toast toast--${variant}`, role: 'status' }, message);
    region.append(node);
    window.setTimeout(() => {
      node.classList.add('is-leaving');
      window.setTimeout(() => node.remove(), 260);
    }, 2800);
  }

  /** Piccole stelle che partono da un elemento. Puro divertimento. */
  function sparkles(origin, count = 14) {
    if (reducedMotion()) return;
    const layer = document.getElementById('sparkle-layer');
    if (!layer) return;
    const rect = origin.getBoundingClientRect();
    const colors = ['var(--marigold)', 'var(--coral)', 'var(--teal)', 'var(--lavender)', 'var(--butter)'];
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const distance = 45 + Math.random() * 90;
      const spark = el('span', { class: 'sparkle' });
      spark.style.left = `${rect.left + rect.width / 2}px`;
      spark.style.top = `${rect.top + rect.height / 2}px`;
      spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--rot', `${Math.random() * 360}deg`);
      spark.style.setProperty('--size', `${6 + Math.random() * 10}px`);
      spark.style.setProperty('--delay', `${Math.random() * 90}ms`);
      spark.style.background = pick(colors);
      layer.append(spark);
      window.setTimeout(() => spark.remove(), 1000);
    }
  }

  /** Dialogo di conferma coerente con il tema. Restituisce una Promise. */
  function confirmDialog(options = {}) {
    const {
      title = 'Sei sicura?',
      message = '',
      confirmLabel = 'Sì, va bene',
      cancelLabel = 'Annulla',
      danger = false
    } = options;

    const dialog = el('dialog', { class: 'dialog' });
    const form = el('form', { method: 'dialog' });
    form.append(
      el('div', { class: 'dialog__icon', html: App.art.ui.sparkle }),
      el('h2', { class: 'dialog__title', text: title }),
      el('p', { class: 'dialog__message', text: message }),
      el('div', { class: 'dialog__actions' }, [
        el('button', { class: 'btn btn--ghost', value: 'cancel', text: cancelLabel }),
        el('button', {
          class: `btn ${danger ? 'btn--danger' : 'btn--primary'}`,
          value: 'confirm',
          text: confirmLabel,
          autofocus: true
        })
      ])
    );
    dialog.append(form);
    document.body.append(dialog);
    dialog.showModal();

    return new Promise((resolve) => {
      dialog.addEventListener('close', () => {
        resolve(dialog.returnValue === 'confirm');
        dialog.remove();
      }, { once: true });
    });
  }

  /** Testata comune a tutte le pagine interne. */
  function page(options = {}) {
    const { kicker, title, lead, back, actions, className = '' } = options;
    const wrapper = el('section', { class: `page ${className}`.trim() });
    const head = el('header', { class: 'page-head' });

    if (back) {
      head.append(
        el('a', { class: 'back-link', href: `#/${back.href}` }, [
          el('span', { class: 'back-link__icon', html: App.art.ui.arrowLeft }),
          el('span', { text: back.label })
        ])
      );
    }
    if (kicker) {
      head.append(
        el('p', { class: 'kicker' }, [
          el('span', { class: 'kicker__spark', html: App.art.ui.sparkle }),
          el('span', { text: kicker })
        ])
      );
    }
    head.append(el('h1', { text: title }));
    if (lead) head.append(el('p', { class: 'lead', text: lead }));
    if (actions) head.append(el('div', { class: 'page-actions' }, actions));
    wrapper.append(head);
    return wrapper;
  }

  /** Titolo di sezione con eventuale link "vedi tutti". */
  function sectionHead(options = {}) {
    const { kicker, title, text, link } = options;
    const head = el('div', { class: 'section-head' });
    const copy = el('div', { class: 'section-head__copy' });
    if (kicker) copy.append(el('p', { class: 'kicker', text: kicker }));
    copy.append(el('h2', { text: title }));
    if (text) copy.append(el('p', { class: 'section-head__text', text }));
    head.append(copy);
    if (link) {
      head.append(
        el('a', { class: 'text-link', href: `#/${link.href}` }, [
          el('span', { text: link.label }),
          el('span', { class: 'text-link__icon', html: App.art.ui.arrowRight })
        ])
      );
    }
    return head;
  }

  /** Card di uno strumento o di un gioco. */
  function card(item) {
    return el('a', {
      class: 'card',
      href: `#/${item.id}`,
      style: { '--accent': item.accent, '--soft': item.soft }
    }, [
      el('span', { class: 'card__icon', html: App.art.icons[item.art] || App.art.icons.star }),
      el('span', { class: 'card__body' }, [
        el('span', { class: 'card__title', text: item.title }),
        el('span', { class: 'card__tagline', text: item.tagline }),
        el('span', { class: 'card__tags' }, item.tags.map((tag) => el('span', { class: 'tag', text: tag })))
      ]),
      el('span', { class: 'card__arrow', html: App.art.ui.arrowRight })
    ]);
  }

  /** Riquadro "risultato" usato alla fine dei giochi. */
  function resultPanel(options = {}) {
    const { title, message, stats = [], actions = [], mood = 'win' } = options;
    return el('div', { class: `result result--${mood}` }, [
      el('div', { class: 'result__spark', html: App.art.deco.star4('var(--marigold)') }),
      el('p', { class: 'result__kicker', text: mood === 'win' ? 'Fatto!' : 'Fine della partita' }),
      el('h2', { class: 'result__title', text: title }),
      message ? el('p', { class: 'result__message', text: message }) : null,
      stats.length
        ? el('div', { class: 'result__stats' }, stats.map((stat) =>
            el('div', { class: 'result__stat' }, [
              el('strong', { text: stat.value }),
              el('span', { text: stat.label })
            ])
          ))
        : null,
      el('div', { class: 'result__actions' }, actions)
    ]);
  }

  /** Attiva/disattiva lo schermo intero su un elemento. */
  async function toggleFullscreen(target) {
    try {
      if (!document.fullscreenElement) {
        await target.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      toast('Questo browser non permette lo schermo intero qui.', 'error');
    }
  }

  /** Scarica un canvas come PNG, con un fondo color carta. */
  function downloadCanvas(canvas, filename) {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const context = exportCanvas.getContext('2d');
    context.fillStyle = '#fffdf6';
    context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    context.drawImage(canvas, 0, 0);
    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, 'image/png');
  }

  App.dom = { $, $$, el, on, append };
  App.util = { clamp, clock, randInt, shuffle, pick, splitIntoGroups, reducedMotion };
  App.store = store;
  App.sound = sound;
  App.ui = {
    toast,
    sparkles,
    confirm: confirmDialog,
    page,
    sectionHead,
    card,
    resultPanel,
    toggleFullscreen,
    downloadCanvas
  };
})(window.App = window.App || {});
