# Memoria progetto — Polittico Martini

Questo file serve come memoria operativa del progetto. Richiamalo nelle prossime sessioni con:

`@MEMORIA_PROGETTO.md`

Va aggiornato ogni volta che viene completato un passo significativo.

---

## Obiettivo

Realizzare una web app museale interattiva dedicata al Polittico di Santa Caterina di Simone Martini, fruibile via QR code/link su smartphone.

L'esperienza deve essere educativa e museale: l'utente ricostruisce attivamente la struttura dell'opera, comprendendo posizione dei pannelli, gerarchia visiva, registro principale e predella.

---

## Stack e vincoli

- React + Vite
- JavaScript, no TypeScript
- Nessuna libreria UI esterna
- Fruizione principale su smartphone
- Intro in portrait
- Esperienza in landscape
- No drag libero nella meccanica finale
- Interazione prevista: click/tap con movimento vincolato
- Feedback sobrio: glow, micro-pausa, audio breve

---

## Documenti di riferimento

- `Documento-obiettivi-e-sviluppo.md`
- `/Users/andreacarpentieri/Desktop/SAN MATTEO/PRJ Polittico Martini/Documento_Tecnico_Progetto_Polittico_Martini_Completo.pdf`
- `/Users/andreacarpentieri/Desktop/SAN MATTEO/PRJ Polittico Martini/Documento Tecnico Sviluppo - Polittico Martini.docx`
- `/Users/andreacarpentieri/Desktop/SAN MATTEO/PRJ Polittico Martini/Esperienza_Utente_Meccaniche_Gioco_Polittico_Martini.pdf`

---

## Asset disponibili

Cartelle nella root del progetto:

- `place_holder/`
  - `place_holder1.png` ... `place_holder14.png`
- `puzzle_piece/`
  - `puzzle1.png` ... `puzzle14.png`

Dimensioni misurate dei placeholder:

- 1: `399x1349`
- 2: `403x1338`
- 3: `412x1352`
- 4: `568x1667`
- 5: `409x1347`
- 6: `404x1341`
- 7: `401x1334`
- 8: `419x341`
- 9: `424x332`
- 10: `411x344`
- 11: `562x335`
- 12: `420x335`
- 13: `403x330`
- 14: `416x341`

Dimensioni misurate dei puzzle piece:

- 1: `392x1342`
- 2: `396x1332`
- 3: `405x1346`
- 4: `560x1660`
- 5: `403x1340`
- 6: `396x1334`
- 7: `393x1327`
- 8: `412x333`
- 9: `417x325`
- 10: `405x337`
- 11: `554x327`
- 12: `413x327`
- 13: `396x323`
- 14: `409x333`

---

## Struttura puzzle

Il puzzle definitivo è composto da 14 pezzi:

- pezzi 1-7: registro superiore / principale
- pezzi 8-14: fascia inferiore / predella
- pezzo 4: pannello centrale, più largo e più alto
- pezzo 11: elemento centrale della predella, più largo degli altri elementi bassi

Schema visivo:

- riga superiore: `1 2 3 4 5 6 7`
- riga inferiore: `8 9 10 11 12 13 14`

---

## Flusso utente previsto

1. L'utente accede tramite QR code o link, normalmente da smartphone in verticale.
2. Vede l'intro portrait con titolo, contesto sintetico, tre istruzioni e CTA.
3. Tocca "Inizia l'esperienza".
4. Se il dispositivo e' portrait, vede il messaggio di rotazione.
5. In landscape entra nello stage e vede la struttura del polittico.
6. Il sistema attiva un target, ad esempio "Trova: Pezzo 4" o in seguito "Trova: Madonna col Bambino".
7. L'utente tocca/clicca i pezzi secondo una regola vincolata.
8. Quando il pezzo corretto raggiunge lo slot, il sistema verifica la corrispondenza.
9. Se corretto: snap, blocco, glow dorato, micro-pausa e audio breve.
10. Il sistema passa al target successivo.
11. A completamento dei 14 pezzi, l'opera ricomposta viene mostrata integralmente con breve conclusione.

---

## Meccanica di gioco scelta / consigliata

- Non usare drag libero come meccanica finale.
- Prima implementazione consigliata: **swap a click/tap**.
- Versione avanzata possibile: **sliding orizzontale per riga**.
- Evitare movimento globale 2D libero.
- La mescolanza iniziale deve essere controllata, non totalmente casuale.
- I pezzi devono rimanere nella loro fascia:
  - pezzi 1-7 solo nel registro superiore;
  - pezzi 8-14 solo nella predella.
- Lo slot target e' una posizione attiva evidenziata, associata a un testo "Trova: ...".
- La difficolta' deve derivare da obiettivi chiari e progressivi, non da confusione visiva.

---

## Stati previsti dei pezzi

- `available`: pezzo mobile, normale.
- `target`: pezzo richiesto dal target attivo; puo' essere indicato nel testo, non necessariamente evidenziato direttamente.
- `moving`: pezzo durante scambio/scorrimento, con transizione morbida.
- `correct`: pezzo nella posizione giusta, glow breve.
- `locked`: pezzo risolto, non piu' modificabile.
- `invalid`: mossa non consentita; feedback nullo o molto discreto.

---

## Feedback e audio

Feedback positivo:

- snap preciso alla sagoma;
- glow dorato leggero;
- micro-pausa di circa `0.3-0.6s`;
- blocco del pezzo corretto;
- audio contestuale breve;
- stato completato con stabilita' visiva sobria.

Audio:

- durata consigliata: `6-10s` per pezzo;
- struttura: chi/cosa e' rappresentato, perche' sta in quella posizione, dettaglio da osservare;
- tono chiaro, museale, non accademico;
- deve partire solo quando il pezzo viene collocato correttamente;
- deve poter essere disattivato/riattivato;
- niente audio lunghi o non interrompibili.

---

## Regole UX da non violare

- Non deformare mai le immagini dei pezzi.
- Non generare scroll verticale nello stage landscape.
- Non coprire lo stage con testi o pulsanti troppo grandi.
- Non usare animazioni eccessive.
- Non usare colori accesi fuori palette.
- Non permettere sovrapposizione libera dei pezzi.
- Non introdurre punteggi o logiche competitive.
- Non far partire audio lunghi o non interrompibili.
- Tutte le azioni critiche devono essere attivabili tramite tap/click.
- Mantenere una UI accessibile: controlli etichettati, focus visibile, istruzioni chiare.

---

## Stato implementazione

### Completato

- Progetto Vite + React avviato.
- Intro portrait creata.
- Experience landscape creata.
- Blocco/messaggio orientamento portrait per esperienza.
- Stile museale scuro/oro impostato in `src/App.css`.
- `polittico-stage` creato.
- I 14 placeholder sono visualizzati nello stage.
- Lo stage è responsive in landscape e non deve generare scroll verticale.
- I placeholder sono montati seguendo lo schema reale con coordinate assolute, non più con griglia a celle.
- Sono state aggiunte micro-sovrapposizioni per eliminare le fessure nere fra PNG separati.
- Dati dei 14 pezzi estratti in `src/data/panels.js`.
- `App.jsx` legge i dati da `puzzlePieces`.
- `Documento-obiettivi-e-sviluppo.md` aggiornato con stato e asset.
- I `puzzle_piece` sono stati integrati sopra i placeholder, inizialmente in posizione corretta.
- I puzzle reali sono renderizzati come overlay assoluto sopra la sagoma corrispondente, senza click, movimento, target o audio.
- Correzione overlay puzzle: i puzzle non vengono piu' scalati secondo il rapporto `puzzle / placeholder`, ma occupano lo stesso rettangolo di montaggio dei placeholder per combaciare visivamente.
- Creato stato gioco base senza audio.
- Aggiunto `currentIndex` controllato in `src/data/panels.js` per mescolare i pezzi dentro la propria fascia.
- I placeholder restano fissi nelle posizioni corrette.
- I puzzle reali si posizionano in base allo stato React `positions`.
- Primo target implementato: `Pezzo 4`.
- Implementato swap a click/tap: toccando un pezzo della stessa fascia, questo scambia posizione con lo slot target.
- Se il pezzo corretto entra nello slot, viene bloccato e riceve un glow dorato.
- Correzione meccanica successiva: i pezzi sbagliati possono spostarsi/scambiarsi con lo slot target, come richiesto.
- Per evitare il bianco dei placeholder quando i pezzi cambiano slot, i puzzle sono ancorati sempre in basso nello slot e leggermente espansi.
- I pezzi puzzle partono in bianco e nero; solo il pezzo corretto/bloccato torna a colori.
- La posizione del pezzo da trovare e' evidenziata da un frame/bordino oro indipendente sopra lo slot target.
- Corretto blocco del target risolto: dopo che `Pezzo 4` e' collocato, ulteriori tap non possono piu' spostarlo ne' usare il suo slot.
- Aggiunto segnale di successo piu' chiaro: HUD con bordo/colore oro e bordo oro stabile sul pezzo bloccato.
- Correzione UI: l'HUD/avviso e' stato spostato fuori dal frame del polittico, sopra lo stage.
- Correzione feedback: rimosso il bordo stabile dal pezzo bloccato per non confonderlo con la cornice target; resta colore + glow.
- Implementata sequenza completa di target senza audio.
- Dopo ogni pezzo corretto, il pezzo si blocca, resta a colori e il target passa automaticamente al pezzo successivo.
- A completamento della sequenza viene mostrato stato "Polittico ricomposto".
- Corretto layout landscape per smartphone: rimosso titolo centrale dell'experience, polittico quasi a tutta altezza e HUD/istruzioni in colonna laterale sinistra.
- L'HUD mostra ora titolo breve, target, messaggio operativo e avanzamento `pezzi corretti / 14`.
- Rimossa la barra superiore in landscape: il pulsante "Torna all'introduzione" e' ora un controllo testuale discreto dentro il pannello laterale, cosi' il polittico puo' sfruttare quasi tutta l'altezza dello schermo.
- Ridisegnata la pagina introduttiva: card centrale piu' museale, soprattitolo, descrizione breve, tre passaggi ordinati e CTA principale piu' elegante.
- Ottimizzato il layout landscape: il pannello istruzioni usa tipografia fluida legata alla larghezza del contenitore, il frame del puzzle e' ancorato a destra con margine leggero.
- Rimossi i placeholder dal rendering e dagli import dati: l'experience ora usa solo i PNG `puzzle_piece`, con la cornice target sopra.
- Corretto il design landscape dopo verifica screenshot: la colonna sinistra non e' piu' una striscia stretta, ma occupa lo spazio residuo fino al puzzle; l'HUD e' un blocco compatto e il polittico resta in una colonna a rapporto fisso ancorata a destra.
- Corretto target frame: la cornice dorata usa ora un `outline` con offset positivo, cosi' contiene anche l'espansione visiva dei puzzle necessaria a coprire le fessure.
- Ricentrata la cornice target con pseudo-elemento asimmetrico, per compensare l'espansione dei puzzle verso destra e verso l'alto.
- I pezzi risolti/bloccati hanno ora un livello superiore (`z-index`) rispetto ai pezzi ancora mobili; la cornice target resta sopra tutti.

### File principali attuali

- `src/App.jsx`
- `src/App.css`
- `src/data/panels.js`
- `Documento-obiettivi-e-sviluppo.md`
- `MEMORIA_PROGETTO.md`

---

## Decisioni tecniche importanti

- Gli asset non sono stati spostati in `public/`.
- I PNG vengono caricati con `new URL(..., import.meta.url)` da `src/data/panels.js`.
- Vite li include correttamente nel build.
- Il layout placeholder usa una canvas logica con rapporto `2996 / 2011`.
- I pezzi sono posizionati con classi CSS `.polyptych-piece--1` ... `.polyptych-piece--14`.
- Le fessure nere tra immagini erano causate da trasparenza/anti-alias dei PNG separati, non da `gap` CSS.
- Soluzione applicata: leggera sovrapposizione visiva delle immagini.
- Ogni `polyptych-piece` contiene due immagini: placeholder sotto e puzzle reale sopra.
- Placeholder e puzzle condividono lo stesso rettangolo CSS e la stessa micro-sovrapposizione; questo evita che il puzzle appaia piu' piccolo o disallineato dentro la sagoma.
- Lo stato iniziale usa una mescolanza controllata separata per `upper` e `predella`.
- La prima interazione usa swap verso lo slot target per i pezzi della fascia corretta, non drag e non sliding avanzato.
- I pezzi interattivi sono `button` nativi, quindi attivabili con tap/click e tastiera.
- I puzzle mobili usano `filter: grayscale(1)`; lo stato locked rimuove il filtro.
- I puzzle sono posizionati con `bottom: 0`, `object-position: bottom center` e piccola espansione dimensionale per mantenere la base coperta.
- Il bordo oro del target e' renderizzato come livello separato `.polyptych-piece--target-frame`, sopra puzzle e placeholder, cosi' resta visibile quando lo slot e' occupato da un pezzo sbagliato e scompare quando il target e' risolto.
- Il componente `PolitticoGame` contiene ora un wrapper `.game-panel`: HUD laterale a sinistra e `polittico-stage` a destra in landscape.
- La sequenza target attuale in `App.jsx` e': `4, 1, 7, 2, 6, 3, 5, 11, 8, 14, 9, 13, 10, 12`.
- Il layout landscape usa CSS Grid con colonna laterale compatta e stage dimensionato in base all'altezza disponibile (`100dvh` meno un margine minimo responsive) mantenendo il rapporto reale `2996 / 2011`.
- In landscape non si usa piu' `.experience-bar`: la schermata parte da `100dvh` pieno e il calcolo dello stage usa solo un margine minimo responsive.
- L'intro usa una singola CTA primaria e istruzioni sintetiche in formato timeline, per non sovraccaricare l'utente prima dell'esperienza.
- I placeholder restano documentati come asset disponibili, ma non sono piu' caricati nel bundle dell'app finche' non serviranno di nuovo.

---

## Verifiche già fatte

Comando usato più volte:

```sh
npm run build
```

Risultato: build completata correttamente.

Linter: nessun errore rilevato sui file modificati.

---

## Prossimo step consigliato

Verificare in preview landscape su smartphone reale o simulatore:

- il polittico deve usare quasi tutta l'altezza disponibile senza scroll;
- il pannello istruzioni deve restare leggibile a sinistra e non coprire l'opera;
- il comando "Torna all'introduzione" deve sembrare secondario e non una barra di navigazione;
- la pagina introduttiva deve risultare elegante in portrait e non troppo lunga su smartphone piccoli;
- su landscape piccoli, i testi del pannello laterale devono scalare senza uscire o occupare troppo spazio;
- il build non deve piu' includere asset `place_holder`.
- verificare che non resti un grande vuoto tra pannello istruzioni e polittico.
- verificare che la cornice dorata contenga interamente il pezzo visibile in tutti gli slot.
- la sequenza target deve avanzare da `Pezzo 4` fino a completamento;
- i pezzi devono rimanere allineati alla base quando si scambiano;
- i pezzi risolti devono restare colorati e bloccati.

Dopo verifica visiva/UX, prossimo sviluppo:

- rifinire ordine didattico dei target se necessario;
- aggiungere micro-pausa/animazione prima del passaggio al target successivo;
- aggiungere reset esperienza;
- mantenere audio ancora disattivato finche' la meccanica non e' approvata.

---

## Regola operativa

Ogni nuovo passo completato deve aggiornare questo file nella sezione "Stato implementazione" e, se necessario, nelle sezioni "Decisioni tecniche importanti" e "Prossimo step consigliato".
