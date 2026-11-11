# Il quaderno di Lucrezia

Strumenti e giochi per la scuola primaria, in un sito statico che vive interamente nel browser.
Niente account, niente database, niente pubblicità: solo HTML, CSS, JavaScript e tanta carta colorata.

## Cosa c'è dentro

**Strumenti**

- Timer di classe con quadrante, preset, schermo intero e suono di fine tempo.
- La carta del sorteggio, con elenco condiviso e opzione “senza ripetizioni”.
- Fabbrica di gruppi equilibrati, con squadre colorate e stampa.
- Lavagna magica su canvas: colori, gomma, annulla e salvataggio in PNG.
- Dadi e monete, con uno o due dadi e testa o croce.

**Giochi**

- Memory incantato, in tre livelli.
- Tris delle falene, contro una piccola IA o in due giocatori.
- Quiz lampo di matematica, tre livelli e sessanta secondi.
- Le campanelle, un Simon con quattro note.
- La casa delle falene, trenta secondi di riflessi.

## Provarlo in locale

Non serve installare nulla. Basta un server statico:

```bash
python3 -m http.server 8000
```

Poi apri <http://localhost:8000>.

Il sito usa script classici e percorsi relativi, quindi funziona anche aperto direttamente da `file://`.
Il service worker invece si attiva solo quando la pagina viene servita da HTTP o HTTPS.

## Pubblicarlo su GitHub Pages

1. Crea un repository su GitHub e carica il contenuto di questa cartella nella radice.
2. Vai in **Settings → Pages**.
3. In **Build and deployment** scegli **Deploy from a branch**, ramo `main`, cartella `/ (root)`.
4. Salva e attendi la pubblicazione.

I percorsi sono tutti relativi (`./...`), quindi il sito funziona sia su un dominio personale sia
su un indirizzo del tipo `https://nomeutente.github.io/nome-repository/`.

## Struttura

```text
index.html              guscio dell'app, header, footer e ordine degli script
manifest.webmanifest    dati per l'installazione come app
sw.js                   cache offline (service worker)
assets/fonts/           Fraunces, Nunito e Caveat in formato woff2
assets/favicon.svg      icona del sito
css/base.css            palette, tipografia, componenti e animazioni comuni
css/views.css           layout delle pagine, degli strumenti e dei giochi
js/art.js               illustrazioni e icone SVG originali
js/data.js              elenco di strumenti, giochi, squadre e dati demo
js/core.js              DOM, utilità, localStorage, suoni e componenti UI
js/router.js            router basato sull'hash, con pulizia automatica
js/app.js               avvio: suoni, service worker, router
js/views/*.js           una pagina per file
```

Ogni pagina si registra con `App.router.register(id, { title, section, mount })`.
Il router passa a `mount` un contesto (`ctx`) con `signal`, `timeout`, `interval`, `on` e `go`:
listener e timer vengono rimossi da soli quando si cambia pagina.

## Dati e privacy

- I nomi della classe sono salvati in `localStorage` con la chiave `lucrezia.class.names`.
- Record e preferenze dei giochi restano anch'essi nel browser.
- Non ci sono richieste a servizi esterni, analytics, cookie di tracciamento o immagini remote.
- Per cancellare tutto: impostazioni del browser → dati del sito.

## Aggiornare il sito

Quando modifichi un file, cambia `VERSION` in `sw.js` (per esempio `2026-11-11.2`).
La nuova cache sostituisce la vecchia e gli utenti ricevono la versione aggiornata.

## Crediti

Caratteri distribuiti con licenza SIL Open Font License:
Fraunces, Nunito e Caveat.
Illustrazioni, icone e mascotte sono originali e disegnate per questo progetto.
