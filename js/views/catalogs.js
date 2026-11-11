/* ============================================================
   catalogs.js — Le due vetrine: strumenti e giochi.
   ============================================================ */
(function (App) {
  'use strict';

  const { el } = App.dom;

  function catalog(options) {
    const { kicker, title, lead, items, note, noteIcon } = options;
    return {
      mount(root) {
        root.append(
          App.ui.page({
            kicker,
            title,
            lead,
            className: 'catalog-page'
          }),
          el('div', { class: 'card-grid card-grid--catalog' }, items.map(App.ui.card)),
          el('aside', { class: 'catalog-note' }, [
            el('span', { class: 'catalog-note__icon', html: noteIcon || App.art.ui.sparkle }),
            el('p', { text: note })
          ])
        );
      }
    };
  }

  App.router.register('strumenti', {
    title: 'Strumenti per la classe',
    section: 'strumenti',
    ...catalog({
      kicker: 'Per la maestra',
      title: 'Strumenti per la classe',
      lead: 'Tutto quello che serve per organizzare la giornata: un timer, un sorteggio, le squadre, una lavagna e i dadi. Niente da installare.',
      items: App.data.tools,
      note: 'Consiglio: apri lo strumento e premi lo schermo intero. Da lì in poi è solo la classe a guardare.'
    })
  });

  App.router.register('giochi', {
    title: 'Giochi per la classe',
    section: 'giochi',
    ...catalog({
      kicker: 'Per giocare',
      title: 'Giochi per la classe',
      lead: 'Sfide brevi da fare alla LIM o sul tablet. Si può giocare da soli, a coppie o tutti insieme.',
      items: App.data.games,
      note: 'Tocca una card per iniziare. I record restano sul dispositivo, così la prossima volta si riparte da lì.',
      noteIcon: App.art.ui.sparkle
    })
  });
})(window.App = window.App || {});
