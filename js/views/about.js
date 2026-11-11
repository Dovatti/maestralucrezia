/* ============================================================
   about.js — Il progetto, la privacy, i crediti.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  function proseBlock(title, paragraphs) {
    return el('section', { class: 'prose-block' }, [
      el('h2', { text: title }),
      ...paragraphs.map((paragraph) => el('p', { html: paragraph }))
    ]);
  }

  App.router.register('progetto', {
    title: 'Il progetto',
    section: 'progetto',
    mount(root) {
      const page = App.ui.page({
        kicker: 'Dietro le quinte',
        title: 'Un quaderno fatto con cura',
        lead: 'Questo posto è nato per Lucrezia e per la sua classe: strumenti semplici, giochi gentili e nessuna distrazione inutile.',
        className: 'about-page'
      });

      const layout = el('div', { class: 'about-layout' }, [
        el('div', { class: 'prose' }, [
          proseBlock('Perché esiste', [
            'In classe il tempo è prezioso. Servono un timer che si veda da tutti, un sorteggio che non faccia polemiche, una lavagna che si apre in un secondo. E poi, ogni tanto, serve anche ridere insieme.',
            'Qui ogni strumento fa una cosa sola e la fa bene. Niente menu complicati, niente passaggi nascosti: si apre, si usa, si chiude.'
          ]),
          proseBlock('Come è fatto', [
            'Il sito è <strong>statico</strong>: solo HTML, CSS e JavaScript. Non c’è un server, non c’è un database, non c’è una build da lanciare. I disegni sono SVG scritti a mano e i suoni sono sintetizzati dal browser.',
            'Può vivere su <strong>GitHub Pages</strong> gratuitamente. Dopo la prima visita, un piccolo service worker conserva i file e il quaderno funziona anche senza connessione.'
          ]),
          proseBlock('Privacy, davvero', [
            'I nomi che scrivi nel sorteggio o nella fabbrica di gruppi restano nel <strong>localStorage</strong> del tuo browser. Non vengono inviati da nessuna parte, non finiscono in un database, non li vede nessuno.',
            'Non ci sono cookie di tracciamento, pubblicità o analytics. Se vuoi cancellare tutto, basta svuotare i dati del sito dalle impostazioni del browser.'
          ]),
          proseBlock('Consigli d’uso', [
            'Sulla LIM conviene lo <strong>schermo intero</strong>: c’è un bottone apposta dentro timer e lavagna. I suoni si accendono e si spengono dall’icona in alto a destra.',
            'Su tablet e computer puoi anche <strong>installare</strong> il quaderno come app dal menu del browser: si apre in una finestra sua e resta disponibile offline.'
          ]),
          proseBlock('Crediti', [
            'Caratteri: <strong>Fraunces</strong>, <strong>Nunito</strong> e <strong>Caveat</strong>, distribuiti con licenza SIL Open Font License. Illustrazioni e icone sono originali, disegnate per questo progetto.',
            'Una nota speciale va a tutte le maestre che trasformano un’aula in un posto un po’ magico.'
          ])
        ]),
        el('aside', { class: 'about-aside' }, [
          el('div', { class: 'note-card' }, [
            el('span', { class: 'note-card__moon', html: App.art.icons.moon }),
            el('p', { class: 'note-card__hand', text: '“Le cose belle si imparano giocando.”' }),
            el('p', { class: 'note-card__caption', text: 'Un pensiero appeso sopra la cattedra.' })
          ]),
          el('div', { class: 'fact-card' }, [
            el('h2', { text: 'In breve' }),
            el('ul', { class: 'fact-list' }, [
              el('li', { html: '<strong>0</strong> account da creare' }),
              el('li', { html: '<strong>0</strong> cookie di tracciamento' }),
              el('li', { html: '<strong>100%</strong> nel browser' }),
              el('li', { html: '<strong>1</strong> piccola magia' })
            ])
          ]),
          el('a', { class: 'btn btn--primary', href: '#/strumenti' }, [
            el('span', { text: 'Entra negli strumenti' }),
            el('span', { class: 'btn__icon', html: App.art.ui.arrowRight })
          ])
        ])
      ]);

      page.append(layout);
      root.append(page);
    }
  });
})(window.App = window.App || {});
