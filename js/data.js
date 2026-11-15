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
    },
    {
      id: 'parola',
      title: 'La parola segreta',
      tagline: 'Indovina la parola una lettera alla volta.',
      art: 'book',
      accent: 'var(--plum)',
      soft: 'var(--lilac)',
      tags: ['Lettere', '6 vite']
    },
    {
      id: 'anagrammi',
      title: 'Anagrammi incantati',
      tagline: 'Rimetti in ordine le lettere e scopri la parola.',
      art: 'flower',
      accent: 'var(--teal)',
      soft: 'var(--mint)',
      tags: ['Parole', '60 secondi']
    },
    {
      id: 'intruso',
      title: 'Trova l’intruso',
      tagline: 'Quattro cose, una non c’entra. Quale sarà?',
      art: 'star',
      accent: 'var(--marigold)',
      soft: 'var(--butter)',
      tags: ['Logica', '10 domande']
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

  /**
   * Parole per i giochi di lettere (parola segreta e anagrammi).
   * Solo lettere dell'alfabeto italiano: niente J, K, W, X, Y.
   */
  const words = [
    { word: 'GATTO', hint: 'Dorme sul divano e fa le fusa.', category: 'Animali' },
    { word: 'CANE', hint: 'Scodinzola quando sei contento tu.', category: 'Animali' },
    { word: 'VOLPE', hint: 'Astuta, con la coda rossa.', category: 'Animali' },
    { word: 'RAGNO', hint: 'Tesse la tela negli angoli.', category: 'Animali' },
    { word: 'FALENA', hint: 'La cugina notturna della farfalla.', category: 'Animali' },
    { word: 'FARFALLA', hint: 'Vola di fiore in fiore.', category: 'Animali' },
    { word: 'TALPA', hint: 'Scava gallerie sotto la terra.', category: 'Animali' },
    { word: 'CIVETTA', hint: 'Ha gli occhi grandi e veglia di notte.', category: 'Animali' },

    { word: 'SCUOLA', hint: 'Ci si va ogni mattina.', category: 'Scuola' },
    { word: 'MATITA', hint: 'Ha la punta e si tempera.', category: 'Scuola' },
    { word: 'QUADERNO', hint: 'Fogli a righe tenuti insieme.', category: 'Scuola' },
    { word: 'GOMMA', hint: 'Cancella gli errori.', category: 'Scuola' },
    { word: 'LIBRO', hint: 'Racconta storie tra le pagine.', category: 'Scuola' },
    { word: 'MAESTRA', hint: 'Spiega, aiuta e sorride.', category: 'Scuola' },
    { word: 'BANCO', hint: 'Il tavolo dello studente.', category: 'Scuola' },
    { word: 'ASTUCCIO', hint: 'Custodisce penne e matite.', category: 'Scuola' },

    { word: 'LUNA', hint: 'Brilla nel cielo di notte.', category: 'Natura' },
    { word: 'SOLE', hint: 'Scalda e illumina il giorno.', category: 'Natura' },
    { word: 'STELLA', hint: 'Un puntino luminoso lassù.', category: 'Natura' },
    { word: 'NUVOLA', hint: 'Porta la pioggia.', category: 'Natura' },
    { word: 'BOSCO', hint: 'Tanti alberi insieme.', category: 'Natura' },
    { word: 'MARE', hint: 'Onde e sabbia.', category: 'Natura' },
    { word: 'MONTAGNA', hint: 'Una cima alta da scalare.', category: 'Natura' },
    { word: 'FIORE', hint: 'Profuma e ha i petali.', category: 'Natura' },

    { word: 'TEIERA', hint: 'Fa il tè e fischia.', category: 'Casa' },
    { word: 'CHIAVE', hint: 'Apre la porta.', category: 'Casa' },
    { word: 'SEDIA', hint: 'Serve per sedersi.', category: 'Casa' },
    { word: 'TAVOLO', hint: 'Ci si appoggia il piatto.', category: 'Casa' },
    { word: 'FINESTRA', hint: 'Fa entrare la luce.', category: 'Casa' },
    { word: 'CUSCINO', hint: 'Morbido, per la testa.', category: 'Casa' },
    { word: 'LAMPADA', hint: 'Si accende con l’interruttore.', category: 'Casa' },
    { word: 'SPECCHIO', hint: 'Ci vedi il tuo riflesso.', category: 'Casa' },

    { word: 'FANTASMA', hint: 'Bianco, gentile e un po’ trasparente.', category: 'Magia' },
    { word: 'MAGIA', hint: 'La fa la fata con la bacchetta.', category: 'Magia' },
    { word: 'BACCHETTA', hint: 'La agita la maga.', category: 'Magia' },
    { word: 'POZIONE', hint: 'Una bevanda misteriosa.', category: 'Magia' },
    { word: 'CASTELLO', hint: 'Ha torri e mura.', category: 'Magia' },
    { word: 'LANTERNA', hint: 'Fa luce nella notte.', category: 'Magia' },
    { word: 'SEGRETO', hint: 'Si sussurra a voce bassa.', category: 'Magia' },
    { word: 'STREGA', hint: 'Vola sulla scopa e prepara incantesimi.', category: 'Magia' }
  ];

  /** Quattro cose, una non c'entra: il gioco "Trova l'intruso". */
  const oddOneOut = [
    { items: ['Gatto', 'Cane', 'Volpe', 'Sedia'], answer: 'Sedia', reason: 'La sedia non è un animale.' },
    { items: ['Mela', 'Pera', 'Banana', 'Carota'], answer: 'Carota', reason: 'La carota è una verdura, non un frutto.' },
    { items: ['Rosso', 'Blu', 'Verde', 'Cerchio'], answer: 'Cerchio', reason: 'Il cerchio è una forma, non un colore.' },
    { items: ['Matita', 'Quaderno', 'Gomma', 'Cucchiaio'], answer: 'Cucchiaio', reason: 'Il cucchiaio non serve a scuola.' },
    { items: ['2', '4', '6', '7'], answer: '7', reason: '7 è dispari, gli altri sono pari.' },
    { items: ['Cerchio', 'Quadrato', 'Triangolo', 'Martello'], answer: 'Martello', reason: 'Il martello è un attrezzo, non una forma.' },
    { items: ['Sole', 'Luna', 'Stella', 'Forchetta'], answer: 'Forchetta', reason: 'La forchetta non sta in cielo.' },
    { items: ['Bicicletta', 'Treno', 'Autobus', 'Fungo'], answer: 'Fungo', reason: 'Il fungo non è un mezzo di trasporto.' },
    { items: ['Maglia', 'Pantaloni', 'Calze', 'Finestra'], answer: 'Finestra', reason: 'La finestra non è un vestito.' },
    { items: ['Farfalla', 'Falena', 'Ape', 'Talpa'], answer: 'Talpa', reason: 'La talpa non vola.' },
    { items: ['Pianoforte', 'Flauto', 'Tamburo', 'Pentola'], answer: 'Pentola', reason: 'La pentola non è uno strumento musicale.' },
    { items: ['Gioia', 'Rabbia', 'Tristezza', 'Scarpa'], answer: 'Scarpa', reason: 'La scarpa non è un’emozione.' },
    { items: ['Palla', 'Ruota', 'Arancia', 'Libro'], answer: 'Libro', reason: 'Il libro non è rotondo.' },
    { items: ['Penna', 'Matita', 'Gesso', 'Sasso'], answer: 'Sasso', reason: 'Il sasso non serve per scrivere.' },
    { items: ['Primavera', 'Estate', 'Autunno', 'Martedì'], answer: 'Martedì', reason: 'Martedì è un giorno, non una stagione.' },
    { items: ['Mucca', 'Pecora', 'Gallina', 'Tigre'], answer: 'Tigre', reason: 'La tigre non vive in fattoria.' },
    { items: ['1', '3', '5', '8'], answer: '8', reason: '8 è pari, gli altri sono dispari.' },
    { items: ['Acqua', 'Latte', 'Succo', 'Pane'], answer: 'Pane', reason: 'Il pane si mangia, non si beve.' },
    { items: ['Cane', 'Gatto', 'Coniglio', 'Rosa'], answer: 'Rosa', reason: 'La rosa è un fiore, non un animale.' },
    { items: ['Europa', 'Africa', 'Asia', 'Marte'], answer: 'Marte', reason: 'Marte è un pianeta, non un continente.' }
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

  App.data = { tools, games, teams, memoryPairs, demoNames, praises, words, oddOneOut };
})(window.App = window.App || {});
