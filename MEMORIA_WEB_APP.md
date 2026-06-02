# Memoria web app - Polittico di Santa Caterina

Ultimo aggiornamento: 2 giugno 2026

Questo file riassume come e' costruita la web app, cosa e' stato implementato e quali decisioni tecniche/UX vanno ricordate nelle prossime sessioni. Per lo storico esteso resta valido anche `MEMORIA_PROGETTO.md`.

---

## Obiettivo

La web app e' un'esperienza museale interattiva dedicata al Polittico di Santa Caterina di Simone Martini, pensata per accesso tramite QR code o link da smartphone.

L'utente entra da una schermata introduttiva in verticale, avvia l'esperienza, ruota il dispositivo in orizzontale e ricompone il polittico pezzo dopo pezzo seguendo target guidati.

Non e' pensata come videogioco competitivo: niente punteggio, niente timer, niente drag libero. La meccanica deve aiutare a comprendere la struttura dell'opera, i pannelli, la predella e le figure rappresentate.

---

## Stack

- React 19
- Vite 6
- JavaScript, non TypeScript
- CSS custom in `src/App.css` e `src/index.css`
- Nessuna libreria UI esterna
- Deploy statico: build Vite in `dist`
- Hosting: **solo Cloudflare Pages** (Netlify non è più usato)
- Config Cloudflare Pages: `public/_redirects`

Comandi principali:

```sh
npm run dev
npm run build
npm run preview
```

---

## File principali

- `src/App.jsx`
  - Contiene quasi tutta la logica applicativa: intro, orientamento, preload, fullscreen, gioco, audio, feedback.
- `src/App.css`
  - Contiene layout, stile museale, stage del polittico, HUD, stati dei pezzi, loader intro e responsive landscape.
- `src/data/panels.js`
  - Contiene dati dei 14 pezzi, import asset PNG, dimensioni reali, ordine iniziale, testi e audio.
  - Titoli, `feedbackText` e `audio` sono ora bilingue: oggetti `{ it, en }`.
- `src/data/i18n.js`
  - Tutte le stringhe UI in italiano e inglese (`ui.it`, `ui.en`) + helper `getUi(lang)`.
  - Le stringhe parametriche (status di gioco, progress, ecc.) sono funzioni.
- `scripts/generate-icons.mjs`
  - Genera le icone PWA in `public/` dall'SVG (richiede `sharp`, devDependency).
- `src/main.jsx`
  - Entry point React.
- `index.html`
  - HTML base Vite, meta viewport, meta PWA/Apple e fallback di caricamento.
- `public/_redirects`
  - Fallback SPA per Cloudflare Pages (`/* /index.html 200`).

---

## Struttura dell'esperienza

### Intro

La schermata iniziale e' portrait-first:

- titolo;
- descrizione breve;
- tre step istruttivi;
- barra di caricamento asset;
- CTA `Inizia l'esperienza`;
- nota: dopo l'avvio ruotare in orizzontale.

La CTA resta disabilitata finche' le immagini principali dell'esperienza non sono state precaricate.

### Orientamento

L'esperienza vera e propria e' pensata per landscape.

Se il viewport e' portrait:

- viene mostrato un messaggio: `Ruota il dispositivo in orizzontale per continuare`;
- su iPhone/iPad/iPadOS desktop mode e Android viene mostrato anche il bottone `Ho ruotato, continua`;
- quel bottone attiva il fallback grafico `forcedLandscapeActive`, utile quando il blocco rotazione del telefono impedisce al browser di aggiornare l'orientamento.

La detection mobile usa:

- `navigator.platform` per iOS classico;
- `navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1` per iPadOS in desktop mode;
- `navigator.userAgentData?.platform === 'Android'`;
- fallback `/Android/i.test(navigator.userAgent)`.

### Fullscreen

Quando l'utente clicca `Inizia l'esperienza`, la app prova a entrare in fullscreen con:

- `document.documentElement.requestFullscreen({ navigationUI: 'hide' })`;
- fallback prefissato `webkitRequestFullscreen`.

Questo funziona su Android Chrome/Edge quando consentito dal browser. Su iPhone Safari/Chrome non e' garantito e spesso non funziona per limite di iOS/WebKit: la app ignora il rifiuto e continua comunque.

Nota importante: su iOS il fullscreen vero per elementi non-video non e' affidabile. La strada migliore, se servira' una resa piu' "app-like", e' aggiungere supporto PWA e indicare all'utente di aggiungere il sito alla schermata Home.

---

## Preload e barra di caricamento

E' stato aggiunto un preload esplicito delle 14 immagini dei pezzi puzzle durante l'intro.

Implementazione:

- costante `EXPERIENCE_ASSET_COUNT = puzzlePieces.length`;
- helper `preloadPuzzleImage(src)`;
- creazione di `new Image()`;
- `image.decoding = 'async'`;
- uso di `image.decode()` quando disponibile;
- fallback su `onload`;
- `onerror` risolve comunque, per non bloccare per sempre l'utente;
- stato React `loadedExperienceAssets`;
- percentuale `preloadProgress`;
- flag `experienceReady`.

La barra e' accessibile con `role="progressbar"` e attributi `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.

La barra misura solo immagini, non audio. Gli audio su mobile possono ignorare il preload, quindi non devono bloccare l'avvio.

---

## Asset

Gli asset puzzle sono in:

- `puzzle_piece/puzzle1.png` ... `puzzle_piece/puzzle14.png`

I dati e gli import sono in `src/data/panels.js` tramite:

```js
new URL('../../puzzle_piece/puzzle1.png', import.meta.url).href
```

Vite include questi asset nel build con nomi hashati dentro `dist/assets`.

I placeholder sono ancora documentati in `MEMORIA_PROGETTO.md`, ma l'app attuale renderizza solo i `puzzle_piece`.

---

## Modello dati dei pezzi

Ogni pezzo in `puzzlePieces` contiene:

- `id`
- `index`
- `title`
- `zone`
- `row`
- `column`
- `correctIndex`
- `currentIndex`
- `puzzle: { src, width, height }`
- `audio`
- `feedbackText`
- `description`

Zone:

- pezzi 1-7: `upper`
- pezzi 8-14: `predella`

La predella usa un testo comune `predellaFeedbackText` e un audio comune `/audio/predella.mp3`.

---

## Meccanica di gioco

Il componente principale del gioco e' `PolitticoGame`.

Stati principali:

- `positions`: mappa `piece.id -> slot corrente`;
- `lockedPieces`: pezzi risolti e non piu' modificabili;
- `targetIndex`: indice del target attivo;
- `statusMessage`: messaggio operativo;
- `feedback`: feedback testuale/audio corrente;
- `activeTarget`: pezzo richiesto;
- `isComplete`: completamento esperienza.

La meccanica e' a tap/click:

1. Il sistema mostra un target: `Trova: ...`.
2. L'utente tocca un pezzo.
3. Se il pezzo e' nella fascia sbagliata, viene mostrato un messaggio.
4. Se e' nella fascia corretta, scambia posizione con il pezzo nello slot target.
5. Se il pezzo toccato e' il target corretto:
   - viene bloccato;
   - torna a colori;
   - viene avviato feedback testuale/audio;
   - il target passa al successivo.
6. A fine sequenza viene mostrato `Polittico ricomposto`.

I pezzi sono `button` nativi, quindi sono attivabili anche da tastiera.

---

## Sequenza target

La sequenza attuale e' definita in `TARGET_SEQUENCE` dentro `src/App.jsx`:

```js
[
  'piece_04',
  'piece_01',
  'piece_07',
  'piece_02',
  'piece_06',
  'piece_03',
  'piece_05',
  'piece_11',
  'piece_08',
  'piece_14',
  'piece_09',
  'piece_13',
  'piece_10',
  'piece_12',
]
```

In forma leggibile:

`4, 1, 7, 2, 6, 3, 5, 11, 8, 14, 9, 13, 10, 12`

---

## Layout e stile

Palette:

- fondo scuro;
- oro museale;
- testo caldo;
- accenti sobri.

Principi UX:

- intro elegante, compatta, leggibile in portrait;
- esperienza landscape senza scroll verticale;
- stage del polittico a destra;
- HUD laterale a sinistra;
- target evidenziato con cornice oro;
- pezzi non risolti in bianco e nero;
- pezzi risolti a colori;
- niente animazioni eccessive.

Lo stage mantiene il rapporto del polittico e sfrutta quasi tutta l'altezza disponibile in landscape.

---

## Audio

Musica ambiente:

- file: `/ChurchChill.mp3`;
- volume normale: `0.045`;
- volume abbassato durante narrazione: `0.008`;
- loop attivo;
- controllabile da bottone `Musica on/off`.

Audio narrativi:

- partono solo quando un pezzo viene collocato correttamente;
- vengono creati al momento con `new Audio(piece.audio)`;
- `onended` chiude il feedback;
- `onerror` chiude comunque il feedback;
- se il play fallisce, viene usato un timeout fallback.

Feedback predella:

- l'audio predella viene riprodotto solo la prima volta;
- i successivi pezzi predella mostrano feedback senza ripetere sempre lo stesso audio.

Su mobile il preload audio non e' affidabile, quindi non viene usato come requisito bloccante.

---

## Versione bilingue (IT / EN)

L'app è bilingue italiano/inglese.

- Lo stato `language` ('it' | 'en') vive in `App`, default rilevato da `localStorage` (`polittico-lang`) poi da `navigator.language`, fallback `it`.
- Selettore a **doppia bandierina (IT / EN)** in cima all'intro (componente `LanguageToggle`, bandiere SVG inline).
- La scelta è persistente (`localStorage`) e aggiorna `document.documentElement.lang`.
- Tutti i testi UI passano da `getUi(lang)` (`src/data/i18n.js`).
- I testi e gli audio dei pezzi usano `piece.title[lang]`, `piece.feedbackText[lang]`, `piece.audio[lang]`.

### Audio inglesi

- Vivono in `public/audio_eng/` (la cartella scelta in fase di consegna), con suffisso `_eng` nei nomi file:
  - `1_mariamaddalena_eng.mp3`, `2_sandomenico_eng.mp3`, `3_sangiovanni_evangelista.mp3`,
    `4_madonna_eng.mp3`, `5_sangiovanni_battista_eng.mp3`, `6_sanpietromartire_eng.mp3`,
    `7_santacaterina_giusto_eng.mp3`, `predella_eng.mp3`.
- I percorsi sono mappati in `panels.js` (`audio.en`). Gli italiani restano in `public/audio/`.
- Se un audio inglese manca, vale lo stesso fallback degli italiani (feedback testuale + timeout): l'esperienza non si blocca.

---

## PWA e fullscreen iOS

- Su **iPhone** la Fullscreen API NON è supportata per elementi non-video (limite WebKit, vale per tutti i browser iOS). Non è forzabile via codice. Su iPad e Android invece funziona, quindi `requestAppFullscreen` resta.
- Per dare lo schermo intero su iPhone l'unica via è la **PWA / "Aggiungi alla schermata Home"**.
- Aggiunto in `index.html`: `manifest.webmanifest`, `theme-color`, `apple-touch-icon`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent`, `viewport-fit=cover`.
- `public/manifest.webmanifest`: `display: standalone`, `orientation: any`, icone 192/512/maskable.
- Icone in `public/` (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`), generate da `scripts/generate-icons.mjs` (devDependency `sharp`).
- Nell'intro, **solo su iPhone non in standalone**, compare un avviso bilingue "Aggiungi a Home per lo schermo intero" (`shouldShowIOSInstallHint`).

### Fix animazioni / spostamento pezzi su iOS

Problema iOS: al tocco i pezzi si spostavano di ~1px verso l'alto (e a volte rientravano toccandone un altro). Causa: su Safari iOS la creazione/distruzione di un **layer composito** ri-arrotonda di un subpixel la posizione di un elemento con `top` in percentuale (frazionario).

Cosa NON fare (regressioni già viste):

- NON usare `transform: translateZ(0)` / `will-change` / `backface-visibility` sui pezzi: promuovono un layer permanente che fa lo snap di subpixel in modo stabile (spostamento permanente).

Causa precisa (sticky :hover di iOS):

- Su Safari iOS, dopo il tap lo stato `:hover` resta applicato all'elemento finché non si tocca altrove (per questo il pezzo "ci rimane" e "torna a posto" toccandone un altro).
- Qualunque effetto in `:hover`/`:active` (anche solo ri-renderizzare un `filter`) fa ri-arrotondare di un subpixel la posizione del pezzo, che ha misure in `%` ed è dentro il contenitore del landscape forzato ruotato con `transform: rotate(90deg)` (sottoalbero rasterizzato in un layer).

Indizio decisivo dell'utente: con il tasto "ho ruotato, continua" (landscape forzato via `rotate(90deg)`) il bug NON c'è; appare solo ruotando fisicamente il telefono (layout normale). Differenza: il `rotate(90deg)` promuove tutto in un unico layer composito stabile; il layout normale no.

Soluzione adottata:

- `transform: translateZ(0)` su `.polyptych-layout` (il CONTENITORE della scacchiera, NON i singoli pezzi): replica nel landscape fisico la stessa stabilita' di compositing del landscape forzato, così i pezzi non saltano di un subpixel al tocco. NB: metterlo sui singoli pezzi invece causava uno spostamento permanente (errore già fatto).
- Sui touch NON si applica alcun effetto al tocco sui pezzi: l'hover è confinato a `@media (hover: hover) and (pointer: fine)` (solo desktop, dove non c'è snap di subpixel) e non esiste più alcuna regola `:active` sui pezzi.
- Lasciato invariato il bagliore oro del pezzo bloccato/feedback (l'utente ha confermato che quello non dà problemi).
- Verifica online: il CSS ha hash nel nome (es. `index-fpzyraCr.css`), quindi niente cache HTML vecchia; controllare con `curl https://polittico-martini.pages.dev/ | grep css`.

---

## Crediti / loghi finanziamento (fondo intro)

In fondo all'intro c'è la sezione crediti (`<footer className="intro-credits">`), sempre su **fondo scuro**:

- Riga unica con 4 loghi: Comune di Pisa, OPA, Musei Nazionali di Pisa, Pisa is Turismo.
- Dicitura: "Progetto finanziato a valere sui fondi" / **Legge 20 febbraio 2006, n. 77** / citazione UNESCO (corsivo). Resta in italiano anche con UI in inglese (citazione di legge).
- Logo **Ministero della Cultura** centrato in basso.

Note sui file loghi:

- Gli originali consegnati sono in `public/export_loghi/`. ATTENZIONE: i nomi erano invertiti rispetto alla descrizione — `logo_MN-PI.png` è **Musei Nazionali di Pisa**, `MiC_logo_esteso_BLU.png` è **Ministero della Cultura**.
- Le versioni usate a runtime sono in `public/loghi/` (nomi puliti: `comune`, `opa`, `musei_nazionali`, `pisa_turismo`, `ministero`).
- OPA e Pisa is Turismo avevano sfondo bianco incollato: sono stati riprocessati (bianco → trasparente, inchiostro nero → crema, magenta di "iSa" mantenuto) per stare su fondo scuro. Gli altri sono trasparenti e funzionano nativi su scuro.

---

## Deploy, GitHub e Cloudflare

Hosting: **solo Cloudflare Pages**. Netlify non è più usato (rimosso `netlify.toml`).

Repository:

- `https://github.com/insynchlab/polittico-martini.git`
- branch principale: `main`

Workflow operativo usato:

```sh
npm run build
git add ...
git commit -m "..."
git push origin main
npx wrangler pages deploy dist --project-name=polittico-martini --branch=main
```

Il deploy su Cloudflare avviene via Direct Upload con Wrangler (vedi sotto). Il push su GitHub serve solo a versionare il codice.

Progetto Cloudflare Pages:

- nome progetto: `polittico-martini`
- URL pubblica: `https://polittico-martini.pages.dev`
- ultimo deployment verificato: `https://da378ec6.polittico-martini.pages.dev`

Workflow Cloudflare Direct Upload:

```sh
npm run build
npx wrangler pages deploy dist --project-name=polittico-martini --branch=main
```

Se in futuro si volesse invece collegare Cloudflare Pages a GitHub, usare lo stesso repository e branch `main`.
Impostazioni consigliate:

```sh
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

Per il fallback SPA su Cloudflare Pages e' stato aggiunto `public/_redirects`:

```txt
/* /index.html 200
```

Non salvare in memoria token, claim URL, password o credenziali di deploy.

---

## Commit recenti rilevanti

- `2fafd5f feat: add English version, PWA support and funding credits`
  - Versione bilingue IT/EN con bandierine, audio inglesi, PWA + fix iOS, sezione crediti loghi.
- `04ecf4d fix: show landscape fallback on android`
  - Il bottone `Ho ruotato, continua` ora compare anche su Android.
- `a1082ac feat: request fullscreen on experience start`
  - Tentativo di fullscreen al click su `Inizia l'esperienza`.
- `3d03897 feat: preload experience images`
  - Preload/decode immagini puzzle e barra di caricamento in intro.

---

## Limiti noti

- Fullscreen su iPhone non e' garantito per limiti iOS/WebKit.
- Audio preload su mobile non e' affidabile e puo' essere ignorato dal browser.
- Il bottone `Inizia l'esperienza` ora dipende dal preload immagini: se una rete e' molto lenta, l'utente aspetta prima di entrare.
- Il preload immagini risolve anche in caso di errore, quindi non blocca per sempre, ma se un asset fallisce potrebbe comunque mancare nell'esperienza.
- Lo stato e' tutto locale React: ricaricando la pagina si perde il progresso.

---

## Prossimi miglioramenti possibili

- Aggiungere supporto PWA per iOS:
  - manifest;
  - meta Apple;
  - icone;
  - istruzione "Aggiungi alla schermata Home".
- Aggiungere reset esperienza.
- Migliorare messaggio/fallback se il preload immagini e' lento.
- Test reale su:
  - iPhone Safari;
  - iPhone Chrome;
  - Android Chrome;
  - Android con blocco rotazione attivo.
- Verificare su Cloudflare Pages lo stato reale dei deploy.
- Eventuale ottimizzazione asset PNG se tempi di preload su rete mobile risultano lunghi.

---

## Regole operative per future sessioni

- Prima di modificare la meccanica, leggere `src/App.jsx`, `src/data/panels.js` e questa memoria.
- Prima di cambiare layout, leggere `src/App.css` e testare mentalmente portrait/landscape.
- Non introdurre librerie UI senza motivo forte.
- Non trasformare la meccanica in drag libero.
- Non bloccare l'esperienza su audio o fullscreen.
- Aggiornare questo file dopo ogni modifica significativa a:
  - flusso utente;
  - orientamento/fullscreen;
  - preload;
  - meccanica di gioco;
  - deploy;
  - asset.
