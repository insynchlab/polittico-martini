# Documento di riferimento — Polittico di Santa Caterina (Simone Martini)

**Esperienza interattiva online — Polittico di Santa Caterina di Simone Martini**  
Contesto: Museo Nazionale di San Matteo, Pisa.

File di lavoro per memoria condivisa: obiettivi, vincoli e passi di sviluppo. Aggiornare questo documento quando cambiano requisiti o milestone.

---

## 1. Obiettivo del progetto

- Realizzare un’esperienza digitale fruibile **online** (accesso **QR** o **link**), dedicata al **Polittico di Santa Caterina** di **Simone Martini**.
- Finalità **educative e museali**: non è un videogioco generico, ma strumento per comprendere:
  - struttura del polittico;
  - posizionamento dei pannelli;
  - gerarchia visiva dell’opera;
  - identità delle figure rappresentate;
  - dettagli **iconografici** e **storico-artistici** pertinenti.

**Meccanica di base:** l’utente è invitato a **ricostruire la struttura corretta** dell’opera tramite un’interazione guidata (non solo osservazione passiva).

---

## 2. Modalità di fruizione

| Aspetto | Scelta |
|--------|--------|
| Accesso | QR in museo, link condivisibile, **browser** su **smartphone** |
| Dispositivo primario | **Smartphone** |
| Schermata iniziale | **Portrait** (es. accesso da QR in verticale) |
| Esperienza interattiva | **Landscape** (struttura orizzontale del polittico, interazione su fasce orizzontali) |

---

## 3. Architettura UX (concordata)

1. **Schermata iniziale (portrait)**
   - Introduzione all’opera
   - Breve spiegazione dell’esperienza
   - Pulsante per avviare

2. **Schermata esperienza (landscape)**
   - Area centrale: polittico
   - UI minima: target, audio, reset
   - Struttura a **fasce orizzontali** (es. predella, registro principale, cuspidi — adattare al contenuto reale)

---

## 4. Meccanica interattiva (v1 semplificata)

- I pannelli sono disposti in **una riga** (per ora semplificata; poi estendibile alle fasce).
- **Nessun drag libero**; lo spostamento avviene con **click** (o equivalente tappable).
- I pannelli **scorrono orizzontalmente**.
- Sistema a **slot target**:
  - compare una posizione evidenziata;
  - testo guida, es. «Trova: Santa Caterina».
- Quando il pannello **corretto** entra nello slot:
  - **blocco** (non più spostabile);
  - **illuminazione** (glow);
  - **riproduzione audio**;
  - passo successivo o fine fase, secondo i contenuti.

---

## 5. Vincoli tecnici

- **React** + **Vite**
- **Solo JavaScript** (niente TypeScript)
- **Nessuna libreria UI** (niente MUI, Chakra, ecc.)
- Codice semplice, leggibile, senza complessità superflua

---

## 6. Metodo di lavoro (step piccoli)

- Non costruire tutto in un colpo solo.
- Ogni **task** è **isolato** e **verificabile** prima del passo successivo.
- Attendere istruzioni specifiche per l’implementazione; aggiornare questo `.md` quando un passo è concluso o modifica requisiti.

---

## 7. Organizzazione componenti React (bozza)

| Componente | Ruolo |
|------------|--------|
| `App` | Flusso intro vs esperienza, stato minimo condiviso |
| `IntroScreen` | Portrait: copy + CTA “Inizia” |
| `ExperienceScreen` | Landscape: area polittico + HUD |
| `TargetSlot` | Slot evidenziato + testo obiettivo corrente |
| `PanelRow` | Sequenza orizzontale, gestione click/spostamento |
| `PanelCard` | Stati: attivo, bloccato, corretto, ecc. |
| `Controls` | Target, audio, reset |
| (opz.) `useOrientation` | Rilevamento portrait/landscape se serve al flusso |

---

## 8. Asset e riferimenti

- Documento originale: `Documento Tecnico Sviluppo - Polittico Martini.docx` (cartella progetto / SAN MATTEO).
- Screenshot / prima pagina del documento tecnico: workspace `assets/image-28f62f7b-252d-4fdc-a8c4-f31618cd9a5d.png` (o copia sotto `PROGETTO CURSOR MARTINI` se spostata).
- Asset definitivi attuali:
  - `place_holder/place_holder1.png` ... `place_holder14.png`
  - `puzzle_piece/puzzle1.png` ... `puzzle14.png`
- La struttura dati base dei 14 pezzi è stata consolidata in `src/data/panels.js`, con dimensioni reali misurate dei placeholder e dei puzzle piece.

---

## 9. Checklist avvio ambiente (da completare in locale)

- [ ] **Node.js** + **npm** installati (necessari per Vite e `npm create vite@latest`).
- [ ] Progetto Vite: `react` + **JavaScript** (no TS).
- [ ] Primo run: `npm install` e `npm run dev`, test su **smartphone** in rete o simulazione orientamento.

---

*Ultimo aggiornamento: 26 aprile 2026 — stage statico con 14 placeholder stabilizzato e dati dei pezzi estratti in `src/data/panels.js`.*
