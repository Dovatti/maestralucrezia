/* ============================================================
   data.js — L'unico posto in cui si descrivono strumenti e giochi.
   Le card, le anteprime in home e i titoli delle pagine leggono da qui.
   ============================================================ */
(function (App) {
  'use strict';

  const tools = [
    {
      id: 'timer',
      title: 'Timer di classe',
      tagline: 'Un conto alla rovescia grande quanto la lavagna.',
      art: 'timer',
      accent: 'var(--marigold)',
      soft: 'var(--butter)',
      tags: ['Tutta la classe', '1–60 min']
    },
    {
      id: 'sorteggio',
      title: 'La carta del sorteggio',
      tagline: 'Chi tocca? La sorte decide, con un po’ di magia.',
      art: 'picker',
      accent: 'var(--lavender)',
      soft: 'var(--lilac)',
      tags: ['Nomi', 'Senza ripetizioni']
    },
    {
      id: 'gruppi',
      title: 'Fabbrica di gruppi',
      tagline: 'Dividi la classe in squadre equilibrate in un battito di ciglia.',
      art: 'groups',
      accent: 'var(--teal)',
      soft: 'var(--mint)',
      tags: ['Squadre', '2–8 gruppi']
    },
    {
      id: 'lavagna',
      title: 'Lavagna magica',
      tagline: 'Disegna, scrivi e cancella. Poi salva tutto in un’immagine.',
      art: 'board',
      accent: 'var(--coral)',
      soft: 'var(--coral-soft)',
      tags: ['Disegno', 'Salva PNG']
    },
    {
      id: 'dadi',
      title: 'Dadi e monete',
      tagline: 'Tira il dado, lancia la moneta: il caso entra in classe.',
      art: 'dice',
      accent: 'var(--plum)',
      soft: 'var(--lilac)',
      tags: ['1 o 2 dadi', 'Testa o croce']
    }
  ];

  const games = [
    {
      id: 'memory',
      title: 'Memory incantato',
      tagline: 'Trova le coppie di lune, funghi e fantasmi.',
      art: 'memory',
      accent: 'var(--plum)',
      soft: 'var(--lilac)',
      tags: ['Memoria', '3 livelli']
    },
    {
      id: 'tris',
      title: 'Tris delle falene',
      tagline: 'Tre in fila contro la falena, o sfida un amico.',
      art: 'tris',
      accent: 'var(--coral)',
      soft: 'var(--coral-soft)',
      tags: ['Strategia', '1–2 giocatori']
    },
    {
      id: 'quiz',
      title: 'Quiz lampo',
      tagline: 'Dieci domande di matematica contro il tempo.',
      art: 'quiz',
      accent: 'var(--marigold)',
      soft: 'var(--butter)',
      tags: ['Matematica', '60 secondi']
    },
    {
      id: 'simon',
      title: 'Le campanelle',
      tagline: 'Ripeti la melodia delle campanelle. Quanto resisti?',
      art: 'simon',
      accent: 'var(--teal)',
      soft: 'var(--mint)',
      tags: ['Sequenze', 'Suoni']
    },
    {
      id: 'falene',
      title: 'La casa delle falene',
      tagline: 'Acchiappa le falene prima che volino via.',
      art: 'moths',
      accent: 'var(--lavender)',
      soft: 'var(--lilac)',
      tags: ['Riflessi', '30 secondi']
    }
  ];

  /** Le squadre della fabbrica di gruppi: nome + due colori. */
  const teams = [
    { name: 'Luna', color: 'var(--marigold)', soft: 'var(--butter)' },
    { name: 'Falena', color: 'var(--lavender)', soft: 'var(--lilac)' },
    { name: 'Fungo', color: 'var(--coral)', soft: 'var(--coral-soft)' },
    { name: 'Teiera', color: 'var(--teal)', soft: 'var(--mint)' },
    { name: 'Chiave', color: 'var(--plum)', soft: 'var(--lilac)' },
    { name: 'Fantasma', color: 'var(--sky)', soft: 'var(--mint)' },
    { name: 'Gatto', color: 'var(--rose)', soft: 'var(--rose)' },
    { name: 'Ragno', color: 'var(--ink-soft)', soft: 'var(--paper-2)' }
  ];

  /** Coppie di icone per il memory: nome accessibile + disegno. */
  const memoryPairs = [
    { name: 'luna', art: 'moon' },
    { name: 'pipistrello', art: 'bat' },
    { name: 'fungo', art: 'mushroom' },
    { name: 'chiave', art: 'key' },
    { name: 'teiera', art: 'teacup' },
    { name: 'gatto fantasma', art: 'ghostcat' },
    { name: 'fiore', art: 'flower' },
    { name: 'campanella', art: 'bell' },
    { name: 'falena', art: 'moths' },
    { name: 'ragno', art: 'spider' },
    { name: 'stella', art: 'star' },
    { name: 'libro', art: 'book' }
  ];

  /** Nomi di esempio, condivisi da sorteggio e gruppi. */
  const demoNames = ['Ada', 'Bruno', 'Clara', 'Dario', 'Elsa', 'Fabio', 'Ginevra', 'Ivo', 'Lia', 'Marco', 'Nora', 'Otto'];

  /** Frasi buffe per i risultati dei giochi. */
  const praises = [
    'Che magia!',
    'Bravissima!',
    'Da applausi!',
    'La classe si inchina.',
    'Le falene sono impressionate.'
  ];

  App.data = { tools, games, teams, memoryPairs, demoNames, praises };
})(window.App = window.App || {});
