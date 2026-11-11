/* ============================================================
   art.js — Illustrazioni e icone, tutte in SVG.
   Niente immagini esterne: ogni disegno è qui dentro, leggero e
   colorabile con le variabili CSS del tema.
   ============================================================ */
(function (App) {
  'use strict';

  const INK = 'var(--ink)';

  /** Avvolge un disegno in un SVG 64×64 coerente con il resto del set. */
  function icon(body) {
    return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  }

  /** Icone piccole per i bottoni (24×24). */
  const ui = {
    arrowRight: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    soundOn: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    soundOff: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    expand: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    undo: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 7 4 12l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h9a6 6 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    download: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3v12M7 10l5 5 5-5M4 20h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    print: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    check: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4 12 5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    close: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2c.8 5.2 4 8.4 9 9-5 .6-8.2 3.8-9 9-.8-5.2-4-8.4-9-9 5-.6 8.2-3.8 9-9Z" fill="currentColor"/></svg>`,
    restart: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 3a9 9 0 1 0 4 15 10.5 10.5 0 0 1-4-15Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
  };

  const icons = {
    timer: icon(`
      <circle cx="32" cy="35" r="20" fill="var(--butter)"/>
      <path d="M28 10h8M32 10v5" />
      <path d="M32 35V24M32 35l8 6" />
      <circle cx="32" cy="35" r="2.2" fill="${INK}"/>
      <path d="M32 15v3M32 52v3M12 35h3M49 35h3" />
      <path d="m48 15 2 2M16 15l-2 2" />
    `),

    picker: icon(`
      <rect x="11" y="12" width="32" height="42" rx="5" fill="var(--lavender)" transform="rotate(-7 27 33)"/>
      <rect x="21" y="10" width="32" height="42" rx="5" fill="var(--bone)"/>
      <path d="M37 18l2.5 6.5L46 27l-6.5 2.5L37 36l-2.5-6.5L28 27l6.5-2.5Z" fill="var(--marigold)"/>
      <path d="M29 42h16M29 47h10" />
      <path d="M9 8l1.5 4L15 13.5 11 15l-1.5 4L8 15l-4-1.5L8 12Z" fill="var(--coral)"/>
    `),

    groups: icon(`
      <circle cx="22" cy="24" r="7" fill="var(--rose)"/>
      <circle cx="42" cy="22" r="7" fill="var(--mint)"/>
      <circle cx="32" cy="41" r="7" fill="var(--butter)"/>
      <path d="M10 48c0-7 5-11 12-11s12 4 12 11M34 49c0-6 4-10 10-10s10 4 10 10" fill="var(--bone)"/>
      <path d="M24 55c0-6 4-9 8-9s8 3 8 9" fill="var(--bone)"/>
      <path d="M28 52h8" />
    `),

    board: icon(`
      <rect x="9" y="10" width="46" height="34" rx="3" fill="var(--bone)"/>
      <path d="M9 18h46" />
      <path d="M15 26c5-4 7 4 12 0s7-4 11 0 7 3 10 0" stroke="var(--coral)" stroke-width="3"/>
      <path d="M18 34c4-3 6 3 10 0s6-3 10 0" stroke="var(--teal)" stroke-width="3"/>
      <path d="M22 44 18 57M42 44l4 13M32 44v13" />
    `),

    dice: icon(`
      <rect x="8" y="18" width="28" height="28" rx="6" fill="var(--bone)" transform="rotate(-8 22 32)"/>
      <rect x="30" y="24" width="26" height="26" rx="6" fill="var(--coral)" transform="rotate(9 43 37)"/>
      <circle cx="18" cy="29" r="2.2" fill="${INK}"/><circle cx="26" cy="36" r="2.2" fill="${INK}"/>
      <circle cx="39" cy="32" r="2.2" fill="${INK}"/><circle cx="48" cy="42" r="2.2" fill="${INK}"/>
    `),

    memory: icon(`
      <rect x="7" y="13" width="24" height="34" rx="4" fill="var(--plum)" transform="rotate(-9 19 30)"/>
      <rect x="33" y="17" width="24" height="34" rx="4" fill="var(--bone)"/>
      <path d="M45 24a7 7 0 1 0 3 12 8 8 0 0 1-3-12Z" fill="var(--butter)"/>
      <path d="M15 21c.6 3.8 3 6.2 7 7-4 .8-6.4 3.2-7 7-.6-3.8-3-6.2-7-7 4-.8 6.4-3.2 7-7Z" fill="var(--marigold)"/>
    `),

    tris: icon(`
      <rect x="10" y="10" width="44" height="44" rx="4" fill="var(--bone)"/>
      <path d="M25 10v44M39 10v44M10 25h44M10 39h44" />
      <path d="M15 16c2-2 4-2 6 0M15 22c2 2 4 2 6 0M19 16v6" stroke="var(--coral)" stroke-width="3"/>
      <circle cx="45" cy="45" r="5" stroke="var(--teal)" stroke-width="3"/>
    `),

    quiz: icon(`
      <path d="M10 16c8-3 15-2 22 3 7-5 14-6 22-3v34c-8-3-15-2-22 3-7-5-14-6-22-3Z" fill="var(--bone)"/>
      <path d="M32 19v34" />
      <path d="M37 28l-5 8h5l-3 8 9-10h-5l3-6Z" fill="var(--marigold)" stroke-width="2"/>
    `),

    simon: icon(`
      <path d="M32 8v5" />
      <path d="M20 20c0-7 5-11 12-11s12 4 12 11v14l5 8H15l5-8Z" fill="var(--marigold)"/>
      <path d="M15 42h34" />
      <circle cx="32" cy="48" r="4" fill="var(--coral)"/>
    `),

    moths: icon(`
      <path d="M32 24c-4-10-13-14-22-10 2 6 2 12-1 18 8 1 14 4 18 10 2-4 3-6 5-6s3 2 5 6c4-6 10-9 18-10-3-6-3-12-1-18-9-4-18 0-22 10Z" fill="var(--lavender)"/>
      <path d="M32 26v18" />
      <path d="M32 24c-2-5-5-8-9-9M32 24c2-5 5-8 9-9" />
      <circle cx="32" cy="24" r="2.4" fill="${INK}"/>
      <circle cx="22" cy="27" r="2" fill="${INK}" stroke="none"/><circle cx="42" cy="27" r="2" fill="${INK}" stroke="none"/>
    `),

    /* ---- Piccole illustrazioni per i giochi ---- */
    moon: icon(`
      <path d="M43 9a23 23 0 1 0 12 34A25 25 0 0 1 43 9Z" fill="var(--butter)"/>
      <circle cx="30" cy="27" r="2.2" fill="${INK}" stroke="none"/>
      <path d="M23 34c4 4 10 4 14 0" />
      <path d="M49 16l1.5 4.2 4.2 1.5-4.2 1.5L49 27.4l-1.5-4.2-4.2-1.5 4.2-1.5Z" fill="var(--coral)"/>
    `),

    bat: icon(`
      <path d="M32 25c-3-7-10-10-20-7 3 4 3 8 1 12 5-2 9-1 12 3 3-3 5-4 7-1 2-3 4-2 7 1 3-4 7-5 12-3-2-4-2-8 1-12-10-3-17 0-20 7Z" fill="var(--plum)"/>
      <ellipse cx="32" cy="31" rx="5" ry="8" fill="var(--plum)"/>
      <path d="M28 20l-2-6 6 3M36 20l2-6-6 3" fill="var(--plum)"/>
      <circle cx="30" cy="29" r="1.6" fill="var(--butter)" stroke="none"/><circle cx="34" cy="29" r="1.6" fill="var(--butter)" stroke="none"/>
    `),

    mushroom: icon(`
      <path d="M9 30c0-11 10-19 23-19s23 8 23 19c0 3-2 5-5 5H14c-3 0-5-2-5-5Z" fill="var(--coral)"/>
      <path d="M25 35h14v12c0 5-3 8-7 8s-7-3-7-8Z" fill="var(--bone)"/>
      <circle cx="21" cy="25" r="3" fill="var(--bone)" stroke="none"/><circle cx="37" cy="20" r="3" fill="var(--bone)" stroke="none"/><circle cx="45" cy="28" r="2.4" fill="var(--bone)" stroke="none"/>
      <circle cx="29" cy="45" r="1.6" fill="${INK}" stroke="none"/><circle cx="35" cy="45" r="1.6" fill="${INK}" stroke="none"/>
      <path d="M30 49c1.4 1.4 2.6 1.4 4 0"/>
    `),

    key: icon(`
      <circle cx="32" cy="18" r="10" fill="var(--marigold)"/>
      <circle cx="32" cy="18" r="4" fill="var(--bone)"/>
      <path d="M32 28v27M32 44h9M32 51h6" stroke-width="4"/>
      <path d="M14 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="var(--lavender)"/>
    `),

    teacup: icon(`
      <path d="M12 25h32v12c0 9-7 15-16 15s-16-6-16-15Z" fill="var(--bone)"/>
      <path d="M44 29h4a7 7 0 0 1 0 14h-4" />
      <path d="M10 55h36" />
      <path d="M20 18c-3-4 3-6 0-10M28 18c-3-4 3-6 0-10M36 18c-3-4 3-6 0-10" />
      <path d="M19 35c3 2 6 2 9 0s6-2 9 0" stroke="var(--teal)" stroke-width="3"/>
    `),

    ghostcat: icon(`
      <path d="M19 28c0-10 6-16 13-16s13 6 13 16v20l-4-3-4 3-4-3-4 3-4-3-4 3Z" fill="var(--mint)"/>
      <path d="M19 19l-3-9 10 5M45 19l3-9-10 5" fill="var(--mint)"/>
      <circle cx="27" cy="28" r="3" fill="${INK}" stroke="none"/><circle cx="37" cy="28" r="3" fill="${INK}" stroke="none"/>
      <path d="M29 36c2 2 4 2 6 0" />
      <path d="M45 37c7-2 10 3 8 8-1 3-4 4-6 2" />
    `),

    flower: icon(`
      <circle cx="32" cy="24" r="6" fill="var(--butter)"/>
      <circle cx="32" cy="12" r="7" fill="var(--rose)"/><circle cx="43" cy="19" r="7" fill="var(--rose)"/>
      <circle cx="41" cy="32" r="7" fill="var(--rose)"/><circle cx="23" cy="32" r="7" fill="var(--rose)"/>
      <circle cx="21" cy="19" r="7" fill="var(--rose)"/>
      <path d="M32 36v20M32 48c-8 0-11-4-11-9 7 0 11 3 11 9ZM32 52c7 0 10-3 10-8-6 0-10 3-10 8Z" fill="var(--mint)"/>
      <circle cx="30" cy="23" r="1.4" fill="${INK}" stroke="none"/><circle cx="34" cy="23" r="1.4" fill="${INK}" stroke="none"/>
      <path d="M30 26c1.3 1.3 2.7 1.3 4 0"/>
    `),

    bell: icon(`
      <path d="M32 8v5" />
      <path d="M19 21c0-8 5-12 13-12s13 4 13 12v14l6 9H13l6-9Z" fill="var(--marigold)"/>
      <path d="M13 44h38" />
      <circle cx="32" cy="50" r="4" fill="var(--coral)"/>
      <path d="M24 22c0-3 2-5 5-6" stroke="var(--bone)" stroke-width="3"/>
    `),

    spider: icon(`
      <circle cx="32" cy="38" r="11" fill="var(--plum)"/>
      <circle cx="32" cy="25" r="6" fill="var(--plum)"/>
      <path d="M22 32 12 24M22 38 10 38M23 44 14 52M28 48l-6 8M42 32l10-8M42 38h12M41 44l9 8M36 48l6 8" />
      <circle cx="30" cy="24" r="1.5" fill="var(--bone)" stroke="none"/><circle cx="34" cy="24" r="1.5" fill="var(--bone)" stroke="none"/>
      <path d="M29 42c2 1.5 4 1.5 6 0" stroke="var(--bone)"/>
    `),

    star: icon(`
      <path d="M32 7l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 24l16-2Z" fill="var(--butter)"/>
      <circle cx="28" cy="28" r="1.8" fill="${INK}" stroke="none"/><circle cx="36" cy="28" r="1.8" fill="${INK}" stroke="none"/>
      <path d="M28 34c2.5 2.5 5.5 2.5 8 0"/>
    `),

    book: icon(`
      <path d="M9 15c8-3 16-2 23 4 7-6 15-7 23-4v35c-8-3-16-2-23 4-7-6-15-7-23-4Z" fill="var(--bone)"/>
      <path d="M32 19v35" />
      <path d="M16 24c4-1 7 0 10 2M16 31c4-1 7 0 10 2M16 38c4-1 7 0 10 2" stroke="var(--plum)" stroke-width="2"/>
      <path d="M38 26h10M38 33h10M38 40h6" stroke="var(--plum)" stroke-width="2"/>
      <path d="M40 9v12l4-3 4 3V9Z" fill="var(--coral)"/>
    `)
  };

  /** Decorazioni riutilizzabili (spirali, stelle, puntini). */
  const deco = {
    swirl: (color = 'var(--ink)') => `<svg viewBox="0 0 120 40" aria-hidden="true" focusable="false"><path d="M4 30c14-22 30-26 38-14 6 9-2 18-9 14-8-5 0-14 10-10 12 5 18 16 34 16 14 0 24-8 39-26" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    star4: (color = 'var(--marigold)') => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 1c1 7 4 10 11 11-7 1-10 4-11 11C11 16 8 13 1 12 8 11 11 8 12 1Z" fill="${color}"/></svg>`,
    dots: `<svg viewBox="0 0 60 20" aria-hidden="true" focusable="false"><g fill="var(--ink)"><circle cx="6" cy="10" r="2"/><circle cx="20" cy="10" r="2"/><circle cx="34" cy="10" r="2"/><circle cx="48" cy="10" r="2"/></g></svg>`
  };

  /* ============================================================
     La mascotte: Lucrezia, in piedi davanti alla luna.
     Disegnata con forme semplici, contorni spessi e colori pastello.
     ============================================================ */
  function mascot() {
    return `
    <svg class="mascot" viewBox="0 0 560 640" role="img" aria-label="Illustrazione di Lucrezia, una maestra con un abito a righe, una bacchetta e un gatto fantasma">
      <defs>
        <clipPath id="moon-clip"><circle cx="372" cy="176" r="142"/></clipPath>
        <clipPath id="skirt-clip"><path d="M254 346c16 10 76 10 92 0l38 138c-22 15-52 22-84 22s-62-7-84-22Z"/></clipPath>
        <clipPath id="hair-clip"><path d="M232 214c-8-52 18-94 68-94s76 42 68 94c-3 30-12 54-12 54l-20-12-18 16-18-10-18 10-18-16-20 12s-9-24-12-54Z"/></clipPath>
      </defs>

      <!-- alone e luna a strisce -->
      <circle cx="372" cy="176" r="142" fill="var(--butter)" opacity=".55"/>
      <g clip-path="url(#moon-clip)" opacity=".5">
        <path d="M210 72h330v22H210z" fill="var(--plum)" transform="rotate(-14 372 176)"/>
        <path d="M210 132h330v16H210z" fill="var(--plum)" transform="rotate(-14 372 176)"/>
        <path d="M210 236h330v26H210z" fill="var(--plum)" transform="rotate(-14 372 176)"/>
        <path d="M210 292h330v14H210z" fill="var(--plum)" transform="rotate(-14 372 176)"/>
      </g>
      <circle cx="372" cy="176" r="142" fill="none" stroke="var(--ink)" stroke-width="4"/>

      <!-- pipistrelli -->
      <g fill="var(--plum-deep)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round">
        <path d="M452 96c-3-6-9-8-16-6 2 3 2 6 1 9 4-1 7 0 9 3 2-2 4-2 6 0 2-3 5-4 9-3-1-3-1-6 1-9-7-2-13 0-16 6Z"/>
        <path d="M116 156c-2-5-8-7-14-5 2 3 2 5 1 8 4-1 6 0 8 3 1-2 3-2 5 0 2-3 4-4 8-3-1-3-1-5 1-8-6-2-12 0-14 5Z"/>
        <path d="M480 300c-2-4-7-6-12-4 1 2 1 4 0 7 3-1 5 0 7 2 1-2 2-2 4 0 1-2 3-3 6-2 0-3 0-5 1-7-5-2-10 0-12 4Z"/>
      </g>

      <!-- ramo con lanterne -->
      <path d="M-10 512c52 6 92-10 118-44 18-24 26-52 24-84" fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round"/>
      <path d="M108 468c-14 2-24-4-30-16 14-4 25 1 30 16Z" fill="var(--teal)" stroke="var(--ink)" stroke-width="3"/>
      <path d="M86 404c-14 0-22-8-24-20 14-1 23 6 24 20Z" fill="var(--mint)" stroke="var(--ink)" stroke-width="3"/>
      <g stroke="var(--ink)" stroke-width="2.4">
        <path d="M72 430v26" /><circle cx="72" cy="464" r="9" fill="var(--marigold)"/>
        <path d="M120 354v20" /><circle cx="120" cy="382" r="7" fill="var(--coral)"/>
      </g>

      <!-- ombra a terra -->
      <ellipse cx="300" cy="606" rx="122" ry="18" fill="var(--ink)" opacity=".12"/>

      <!-- gambe a righe -->
      <g stroke-linecap="round">
        <path d="M272 486c-2 28-1 54-5 78" stroke="var(--ink)" stroke-width="22"/>
        <path d="M328 486c2 28 1 54 5 78" stroke="var(--ink)" stroke-width="22"/>
        <path d="M272 486c-2 28-1 54-5 78" stroke="var(--plum-deep)" stroke-width="16"/>
        <path d="M328 486c2 28 1 54 5 78" stroke="var(--plum-deep)" stroke-width="16"/>
        <path d="M272 486c-2 28-1 54-5 78" stroke="var(--bone)" stroke-width="16" stroke-dasharray="4 12" opacity=".75"/>
        <path d="M328 486c2 28 1 54 5 78" stroke="var(--bone)" stroke-width="16" stroke-dasharray="4 12" opacity=".75"/>
      </g>

      <!-- scarpe a punta -->
      <g fill="var(--plum-deep)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round">
        <path d="M253 566c12 6 26 6 38 0 3 8-4 15-14 15h-20c-9 0-12-8-4-15Z"/>
        <path d="M311 566c12 6 26 6 38 0 3 8-4 15-14 15h-20c-9 0-12-8-4-15Z"/>
      </g>
      <path d="M251 570c-7-4-13-2-13 4 0 4 5 6 10 4" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>
      <path d="M349 570c7-4 13-2 13 4 0 4-5 6-10 4" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>

      <!-- gonna a righe -->
      <path d="M254 346c16 10 76 10 92 0l38 138c-22 15-52 22-84 22s-62-7-84-22Z" fill="var(--teal)" stroke="var(--ink)" stroke-width="4"/>
      <g clip-path="url(#skirt-clip)" stroke="var(--bone)" stroke-width="3" opacity=".42">
        <path d="M236 330v220M260 330v220M284 330v220M308 330v220M332 330v220M356 330v220M380 330v220"/>
      </g>
      <path d="M212 476c26 9 54 14 86 14s60-5 86-14" fill="none" stroke="var(--ink)" stroke-width="3" opacity=".55"/>
      <path d="M208 490c28 10 58 15 90 15s62-5 90-15l-4 14c-26 10-55 15-86 15s-60-5-86-15Z" fill="var(--bone)" stroke="var(--ink)" stroke-width="3.5"/>
      <g fill="var(--coral)">
        <circle cx="238" cy="504" r="2.4"/><circle cx="270" cy="508" r="2.4"/><circle cx="302" cy="509" r="2.4"/><circle cx="334" cy="508" r="2.4"/><circle cx="366" cy="504" r="2.4"/>
      </g>
      <!-- toppa sulla gonna -->
      <path d="M324 414h30v26h-30z" fill="var(--lavender)" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M329 420l3 5 6 1-4 4 1 6-6-3-5 3 1-6-4-4 6-1Z" fill="var(--butter)" stroke="var(--ink)" stroke-width="1.8"/>

      <!-- corpetto -->
      <path d="M258 298c14 8 70 8 84 0l-8 56c-20 8-48 8-68 0Z" fill="var(--plum)" stroke="var(--ink)" stroke-width="4"/>
      <path d="M300 308v44" stroke="var(--ink)" stroke-width="2" opacity=".35"/>
      <g fill="var(--bone)" stroke="var(--ink)" stroke-width="2">
        <circle cx="300" cy="316" r="3.2"/><circle cx="300" cy="332" r="3.2"/><circle cx="300" cy="348" r="3.2"/>
      </g>

      <!-- colletto -->
      <path d="M268 284c10 12 54 12 64 0l-7 20c-15 10-35 10-50 0Z" fill="var(--bone)" stroke="var(--ink)" stroke-width="3.5"/>
      <path d="M300 296v14" stroke="var(--ink)" stroke-width="2" opacity=".4"/>

      <!-- braccio sinistro (della figura) abbassato con il libro -->
      <path d="M252 312c-16 18-24 44-20 68 2 14 10 22 18 26" fill="none" stroke="var(--ink)" stroke-width="19" stroke-linecap="round"/>
      <path d="M252 312c-16 18-24 44-20 68 2 14 10 22 18 26" fill="none" stroke="var(--lavender)" stroke-width="13" stroke-linecap="round"/>
      <circle cx="251" cy="410" r="11" fill="var(--lavender)" stroke="var(--ink)" stroke-width="3.5"/>
      <!-- libro -->
      <g transform="rotate(-12 214 438)">
        <rect x="176" y="412" width="76" height="54" rx="4" fill="var(--coral)" stroke="var(--ink)" stroke-width="4"/>
        <rect x="184" y="418" width="60" height="42" rx="2" fill="var(--bone)" stroke="var(--ink)" stroke-width="2.4"/>
        <path d="M214 420v38" stroke="var(--ink)" stroke-width="2" opacity=".5"/>
        <path d="M190 428h18M190 436h18M190 444h14M220 428h18M220 436h18M220 444h12" stroke="var(--ink)" stroke-width="2" opacity=".6"/>
        <path d="M244 412v22l-6-4-6 4v-22" fill="var(--marigold)" stroke="var(--ink)" stroke-width="2.2"/>
      </g>

      <!-- braccio destro alzato con la bacchetta -->
      <path d="M348 310c18 6 32 20 42 40 6 12 8 22 8 30" fill="none" stroke="var(--ink)" stroke-width="19" stroke-linecap="round"/>
      <path d="M348 310c18 6 32 20 42 40 6 12 8 22 8 30" fill="none" stroke="var(--lavender)" stroke-width="13" stroke-linecap="round"/>
      <circle cx="398" cy="384" r="11" fill="var(--lavender)" stroke="var(--ink)" stroke-width="3.5"/>
      <!-- bacchetta -->
      <path d="M402 378 432 330" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>
      <path d="M402 378 432 330" stroke="var(--marigold)" stroke-width="3" stroke-linecap="round"/>
      <path d="M442 310c1.2 8 4.5 11.3 12.5 12.5-8 1.2-11.3 4.5-12.5 12.5-1.2-8-4.5-11.3-12.5-12.5 8-1.2 11.3-4.5 12.5-12.5Z" fill="var(--butter)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>

      <!-- maniche a sbuffo -->
      <circle cx="254" cy="306" r="20" fill="var(--plum)" stroke="var(--ink)" stroke-width="4"/>
      <circle cx="346" cy="306" r="20" fill="var(--plum)" stroke="var(--ink)" stroke-width="4"/>
      <path d="M238 300c6 4 12 5 18 2M334 302c6 3 12 2 18-2" fill="none" stroke="var(--bone)" stroke-width="2" opacity=".6"/>

      <!-- collo -->
      <path d="M286 262h28v30h-28z" fill="var(--lavender)" stroke="var(--ink)" stroke-width="3.5"/>
      <path d="M286 276c8 4 20 4 28 0" fill="none" stroke="var(--ink)" stroke-width="2" opacity=".35"/>

      <!-- orecchie e orecchini -->
      <ellipse cx="236" cy="220" rx="10" ry="16" fill="var(--lavender)" stroke="var(--ink)" stroke-width="3.5"/>
      <ellipse cx="364" cy="220" rx="10" ry="16" fill="var(--lavender)" stroke="var(--ink)" stroke-width="3.5"/>
      <g fill="var(--butter)" stroke="var(--ink)" stroke-width="2.4">
        <path d="M236 240a9 9 0 1 0 5 14 10 10 0 0 1-5-14Z"/>
        <path d="M364 240a9 9 0 1 0 5 14 10 10 0 0 1-5-14Z"/>
      </g>

      <!-- capelli dietro -->
      <path d="M232 214c-8-52 18-94 68-94s76 42 68 94c-3 30-12 54-12 54l-20-12-18 16-18-10-18 10-18-16-20 12s-9-24-12-54Z" fill="var(--plum-deep)" stroke="var(--ink)" stroke-width="4"/>
      <g clip-path="url(#hair-clip)" stroke="var(--plum)" stroke-width="2.5" opacity=".6">
        <path d="M244 130c10 40 10 90 2 140M268 118c6 50 4 100-2 150M332 118c-6 50-4 100 2 150M356 130c-10 40-10 90-2 140"/>
      </g>

      <!-- ciuffo e chignon -->
      <circle cx="300" cy="118" r="38" fill="var(--plum-deep)" stroke="var(--ink)" stroke-width="4"/>
      <path d="M276 104c8-8 18-11 28-8 12 4 17 14 15 26-2 10-11 17-21 15" fill="none" stroke="var(--plum)" stroke-width="3" stroke-linecap="round"/>
      <path d="M330 96l26-30" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>
      <path d="M330 96l26-30" stroke="var(--marigold)" stroke-width="4" stroke-linecap="round"/>
      <path d="M356 66l5-6" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/>
      <path d="M356 66l5-6" stroke="var(--coral)" stroke-width="4" stroke-linecap="round"/>

      <!-- viso -->
      <path d="M300 150c-40 0-63 27-63 64 0 42 28 76 63 76s63-34 63-76c0-37-23-64-63-64Z" fill="var(--lavender)" stroke="var(--ink)" stroke-width="4"/>

      <!-- frangia laterale -->
      <path d="M239 210c-6-46 21-76 62-76 43 0 69 30 62 76-13-20-33-30-57-28-15 1-28 8-38 20-9 7-19 9-29 8Z" fill="var(--plum-deep)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/>
      <path d="M252 190c14-12 32-18 52-16" fill="none" stroke="var(--plum)" stroke-width="3" stroke-linecap="round" opacity=".7"/>

      <!-- sopracciglia -->
      <path d="M260 206c8-5 18-5 26 0M314 206c8-5 18-5 26 0" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>

      <!-- occhi -->
      <g>
        <ellipse cx="276" cy="226" rx="14" ry="17" fill="var(--bone)" stroke="var(--ink)" stroke-width="3"/>
        <ellipse cx="324" cy="226" rx="14" ry="17" fill="var(--bone)" stroke="var(--ink)" stroke-width="3"/>
        <ellipse cx="278" cy="228" rx="7.5" ry="9.5" fill="var(--ink)"/>
        <ellipse cx="322" cy="228" rx="7.5" ry="9.5" fill="var(--ink)"/>
        <circle cx="280.5" cy="224" r="2.8" fill="var(--bone)"/>
        <circle cx="324.5" cy="224" r="2.8" fill="var(--bone)"/>
        <circle cx="275" cy="233" r="1.3" fill="var(--bone)" opacity=".8"/>
        <circle cx="319" cy="233" r="1.3" fill="var(--bone)" opacity=".8"/>
        <path d="M262 220c-3-5-3-10 0-14M338 220c3-5 3-10 0-14" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
      </g>

      <!-- naso e bocca -->
      <path d="M300 240c-2 6-4 9-1 11" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M288 266c5 7 19 7 24 0-5 3-19 3-24 0Z" fill="var(--coral)" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M291 274c5 3 13 3 18 0" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round" opacity=".4"/>

      <!-- guance -->
      <circle cx="256" cy="252" r="10" fill="var(--coral)" opacity=".28"/>
      <circle cx="344" cy="252" r="10" fill="var(--coral)" opacity=".28"/>

      <!-- gatto fantasma -->
      <g transform="translate(448 372)">
        <path d="M-28 0c0-24 12-38 28-38s28 14 28 38v38l-7-6-7 6-7-6-7 6-7-6-7 6-7-6-7 6Z" fill="var(--mint)" stroke="var(--ink)" stroke-width="3.5" opacity=".92"/>
        <path d="M-28 -18l-5-18 18 9M28 -18l5-18-18 9" fill="var(--mint)" stroke="var(--ink)" stroke-width="3.5"/>
        <circle cx="-10" cy="-8" r="4.5" fill="var(--ink)"/><circle cx="10" cy="-8" r="4.5" fill="var(--ink)"/>
        <circle cx="-8.5" cy="-10" r="1.5" fill="var(--bone)"/><circle cx="11.5" cy="-10" r="1.5" fill="var(--bone)"/>
        <path d="M-4 4c3 3 5 3 8 0" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M28 4c12-2 16 7 12 15-2 5-8 6-11 2" fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M-20 12h40" stroke="var(--teal)" stroke-width="3" opacity=".6"/>
      </g>

      <!-- funghi e fiori a terra -->
      <g>
        <path d="M152 592c0-9 7-15 16-15s16 6 16 15c0 3-2 4-5 4h-22c-3 0-5-1-5-4Z" fill="var(--coral)" stroke="var(--ink)" stroke-width="3"/>
        <path d="M161 596h14v10c0 4-3 6-7 6s-7-2-7-6Z" fill="var(--bone)" stroke="var(--ink)" stroke-width="3"/>
        <circle cx="160" cy="586" r="2.4" fill="var(--bone)"/><circle cx="171" cy="582" r="2" fill="var(--bone)"/>
        <path d="M190 604c0-7 5-12 12-12s12 5 12 12c0 2-2 3-4 3h-16c-2 0-4-1-4-3Z" fill="var(--marigold)" stroke="var(--ink)" stroke-width="2.6"/>
        <path d="M197 607h10v8c0 3-2 5-5 5s-5-2-5-5Z" fill="var(--bone)" stroke="var(--ink)" stroke-width="2.6"/>
      </g>
      <g>
        <path d="M406 606v-20M406 592c-8 0-11-4-11-9 7 0 11 3 11 9ZM406 598c7 0 10-3 10-8-6 0-10 3-10 8Z" fill="var(--mint)" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
        <circle cx="406" cy="580" r="6" fill="var(--rose)" stroke="var(--ink)" stroke-width="2.6"/>
      </g>

      <!-- stelle e scintille -->
      <g fill="var(--butter)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round">
        <path d="M92 244c.8 6 3.5 8.7 9.5 9.5-6 .8-8.7 3.5-9.5 9.5-.8-6-3.5-8.7-9.5-9.5 6-.8 8.7-3.5 9.5-9.5Z"/>
        <path d="M492 214c.6 5 2.8 7.2 7.8 7.8-5 .6-7.2 2.8-7.8 7.8-.6-5-2.8-7.2-7.8-7.8 5-.6 7.2-2.8 7.8-7.8Z"/>
        <path d="M474 476c.6 5 2.8 7.2 7.8 7.8-5 .6-7.2 2.8-7.8 7.8-.6-5-2.8-7.2-7.8-7.8 5-.6 7.2-2.8 7.8-7.8Z"/>
      </g>
    </svg>`;
  }

  App.art = { icons, ui, deco, mascot };
})(window.App = window.App || {});
