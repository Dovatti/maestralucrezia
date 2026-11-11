/* ============================================================
   home.js — La copertina del quaderno.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  function hero() {
    return el('section', { class: 'hero' }, [
      el('div', { class: 'hero__copy' }, [
        el('p', { class: 'kicker' }, [
          el('span', { class: 'kicker__spark', html: App.art.ui.sparkle }),
          el('span', { text: 'Ciao, maestra!' })
        ]),
        el('h1', {}, [
          'Un quaderno pieno di ',
          el('em', { text: 'giochi' }),
          ' e ',
          el('em', { text: 'strumenti' }),
          ' per la classe.'
        ]),
        el('p', { class: 'lead' }, [
          'Piccoli aiuti per la giornata a scuola e giochi da fare insieme. ',
          'Tutto dentro il browser: niente account, niente pubblicità, anche senza connessione.'
        ]),
        el('div', { class: 'hero__actions' }, [
          el('a', { class: 'btn btn--primary btn--lg', href: '#/strumenti' }, [
            el('span', { text: 'Scopri gli strumenti' }),
            el('span', { class: 'btn__icon', html: App.art.ui.arrowRight })
          ]),
          el('a', { class: 'btn btn--ghost btn--lg', href: '#/giochi' }, [
            el('span', { text: 'Facciamo un gioco' }),
            el('span', { class: 'btn__icon', html: App.art.ui.sparkle })
          ])
        ]),
        el('div', { class: 'stickers', 'aria-label': 'Caratteristiche del sito' }, [
          el('span', { class: 'sticker sticker--butter', text: 'Niente pubblicità' }),
          el('span', { class: 'sticker sticker--mint', text: 'Anche offline' }),
          el('span', { class: 'sticker sticker--rose', text: 'Fatto a mano' })
        ])
      ]),
      el('div', { class: 'hero__art' }, [
        el('p', { class: 'speech' }, 'Ciao! Da dove cominciamo?'),
        el('div', { class: 'mascot-wrap', html: App.art.mascot() }),
        el('span', { class: 'hero-doodle hero-doodle--star', html: App.art.deco.star4('var(--coral)') }),
        el('span', { class: 'hero-doodle hero-doodle--swirl', html: App.art.deco.swirl('var(--teal)') })
      ])
    ]);
  }

  function featureBand() {
    const features = [
      {
        icon: App.art.ui.sparkle,
        title: 'Leggero davvero',
        text: 'Niente account, niente tracciamenti, niente attese.'
      },
      {
        icon: App.art.ui.moon,
        title: 'Resta sul tuo dispositivo',
        text: 'I nomi della classe non lasciano mai il browser.'
      },
      {
        icon: App.art.ui.check,
        title: 'Funziona offline',
        text: 'Dopo la prima visita, il quaderno è sempre con te.'
      }
    ];

    return el('section', { class: 'feature-band', 'aria-label': 'Come funziona il sito' },
      el('div', { class: 'feature-band__inner' }, features.map((feature) =>
        el('div', { class: 'feature' }, [
          el('span', { class: 'feature__icon', html: feature.icon }),
          el('div', {}, [
            el('h2', { class: 'feature__title', text: feature.title }),
            el('p', { class: 'feature__text', text: feature.text })
          ])
        ])
      ))
    );
  }

  function closing() {
    return el('section', { class: 'closing' }, [
      el('div', { class: 'closing__art', html: App.art.icons.moon, 'aria-hidden': 'true' }),
      el('div', { class: 'closing__copy' }, [
        el('p', { class: 'kicker', text: 'Pronta a cominciare?' }),
        el('h2', { text: 'La classe aspetta solo un po’ di magia.' }),
        el('p', { text: 'Scegli uno strumento, lancia un gioco, oppure scopri come è fatto questo posto.' })
      ]),
      el('div', { class: 'closing__actions' }, [
        el('a', { class: 'btn btn--plum', href: '#/strumenti', text: 'Vai agli strumenti' }),
        el('a', { class: 'btn btn--ghost', href: '#/progetto', text: 'Il progetto' })
      ])
    ]);
  }

  App.router.register('home', {
    title: 'Strumenti e giochi per la classe',
    section: 'home',
    mount(root) {
      const divider = el('div', { class: 'hero-divider', 'aria-hidden': 'true' }, [
        el('span', { class: 'hero-divider__line' }),
        el('span', { class: 'hero-divider__swirl', html: App.art.deco.swirl('var(--plum)') }),
        el('span', { class: 'hero-divider__line' })
      ]);

      root.append(
        hero(),
        divider,
        el('section', { class: 'section' }, [
          App.ui.sectionHead({
            kicker: 'Per la maestra',
            title: 'Piccoli aiuti per la giornata',
            text: 'Timer, sorteggi, squadre e una lavagna: le cose che servono davvero, senza distrazioni.',
            link: { href: 'strumenti', label: 'Tutti gli strumenti' }
          }),
          el('div', { class: 'card-grid' }, App.data.tools.map(App.ui.card))
        ]),
        el('section', { class: 'section' }, [
          App.ui.sectionHead({
            kicker: 'Per giocare insieme',
            title: 'Giochi da fare in classe',
            text: 'Memoria, strategia, riflessi e orecchio musicale. Ogni partita è una piccola avventura.',
            link: { href: 'giochi', label: 'Tutti i giochi' }
          }),
          el('div', { class: 'card-grid' }, App.data.games.map(App.ui.card))
        ]),
        featureBand(),
        closing()
      );
    }
  });
})(window.App = window.App || {});
