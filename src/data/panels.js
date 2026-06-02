const puzzle1 = new URL('../../puzzle_piece/puzzle1.png', import.meta.url).href
const puzzle2 = new URL('../../puzzle_piece/puzzle2.png', import.meta.url).href
const puzzle3 = new URL('../../puzzle_piece/puzzle3.png', import.meta.url).href
const puzzle4 = new URL('../../puzzle_piece/puzzle4.png', import.meta.url).href
const puzzle5 = new URL('../../puzzle_piece/puzzle5.png', import.meta.url).href
const puzzle6 = new URL('../../puzzle_piece/puzzle6.png', import.meta.url).href
const puzzle7 = new URL('../../puzzle_piece/puzzle7.png', import.meta.url).href
const puzzle8 = new URL('../../puzzle_piece/puzzle8.png', import.meta.url).href
const puzzle9 = new URL('../../puzzle_piece/puzzle9.png', import.meta.url).href
const puzzle10 = new URL('../../puzzle_piece/puzzle10.png', import.meta.url).href
const puzzle11 = new URL('../../puzzle_piece/puzzle11.png', import.meta.url).href
const puzzle12 = new URL('../../puzzle_piece/puzzle12.png', import.meta.url).href
const puzzle13 = new URL('../../puzzle_piece/puzzle13.png', import.meta.url).href
const puzzle14 = new URL('../../puzzle_piece/puzzle14.png', import.meta.url).href

const predellaFeedbackText = {
  it: 'Questa fascia inferiore è chiamata predella. Qui sono raffigurati santi e figure che accompagnano la scena principale e completano il racconto dell’opera.',
  en: 'This lower band is called the predella. Here are depicted saints and figures who accompany the main scene and complete the story of the work.',
}

const predellaTitle = {
  it: 'Predella',
  en: 'Predella',
}

const predellaAudio = {
  it: '/audio/predella.mp3',
  en: '/audio_eng/predella_eng.mp3',
}

/**
 * Dati definitivi di base per i 14 pezzi del polittico.
 * Le dimensioni sono quelle reali dei PNG presenti in /puzzle_piece.
 * Titoli, testi e audio sono bilingue (it / en).
 * Gli audio inglesi vivono in /audio/en con gli stessi nomi file degli italiani.
 */
export const puzzlePieces = [
  {
    id: 'piece_01',
    index: 1,
    title: { it: 'Santa Maria Maddalena', en: 'Mary Magdalene' },
    zone: 'upper',
    row: 'main',
    column: 1,
    correctIndex: 0,
    currentIndex: 3,
    puzzle: { src: puzzle1, width: 392, height: 1342 },
    audio: { it: '/audio/1_mariamaddalena.mp3', en: '/audio_eng/1_mariamaddalena_eng.mp3' },
    feedbackText: {
      it: 'Questa figura è Maria Maddalena. Il vaso che tiene tra le mani è il suo simbolo: contiene gli unguenti con cui, secondo la tradizione, onorò il corpo di Cristo.',
      en: 'This figure is Mary Magdalene. The jar she holds in her hands is her symbol: it contains the ointments with which, according to tradition, she honoured the body of Christ.',
    },
  },
  {
    id: 'piece_02',
    index: 2,
    title: { it: 'San Domenico', en: 'Saint Dominic' },
    zone: 'upper',
    row: 'main',
    column: 2,
    correctIndex: 1,
    currentIndex: 0,
    puzzle: { src: puzzle2, width: 396, height: 1332 },
    audio: { it: '/audio/2_sandomenico.mp3', en: '/audio_eng/2_sandomenico_eng.mp3' },
    feedbackText: {
      it: 'Questa figura è San Domenico, fondatore dell’ordine domenicano. Il giglio e il libro richiamano purezza e predicazione.',
      en: 'This figure is Saint Dominic, founder of the Dominican order. The lily and the book evoke purity and preaching.',
    },
  },
  {
    id: 'piece_03',
    index: 3,
    title: { it: 'San Giovanni Evangelista', en: 'Saint John the Evangelist' },
    zone: 'upper',
    row: 'main',
    column: 3,
    correctIndex: 2,
    currentIndex: 4,
    puzzle: { src: puzzle3, width: 405, height: 1346 },
    audio: { it: '/audio/3_sangiovanni_evangelista.mp3', en: '/audio_eng/3_sangiovanni_evangelista.mp3' },
    feedbackText: {
      it: 'Questa figura è San Giovanni Evangelista, riconoscibile dal volto giovane e dal libro del Vangelo.',
      en: 'This figure is Saint John the Evangelist, recognisable by his youthful face and the book of the Gospel.',
    },
  },
  {
    id: 'piece_04',
    index: 4,
    title: { it: 'Madonna col Bambino', en: 'Madonna and Child' },
    zone: 'upper',
    row: 'main',
    column: 4,
    correctIndex: 3,
    currentIndex: 6,
    puzzle: { src: puzzle4, width: 560, height: 1660 },
    audio: { it: '/audio/4_madonna.mp3', en: '/audio_eng/4_madonna_eng.mp3' },
    feedbackText: {
      it: 'Questo è il cuore del polittico: la Madonna con il Bambino, centro visivo e simbolico dell’opera.',
      en: 'This is the heart of the polyptych: the Madonna and Child, the visual and symbolic centre of the work.',
    },
  },
  {
    id: 'piece_05',
    index: 5,
    title: { it: 'San Giovanni Battista', en: 'Saint John the Baptist' },
    zone: 'upper',
    row: 'main',
    column: 5,
    correctIndex: 4,
    currentIndex: 1,
    puzzle: { src: puzzle5, width: 403, height: 1340 },
    audio: { it: '/audio/5_sangiovanni_battista.mp3', en: '/audio_eng/5_sangiovanni_battista_eng.mp3' },
    feedbackText: {
      it: 'Questa figura è San Giovanni Battista, asceta e profeta che annuncia la venuta di Cristo.',
      en: 'This figure is Saint John the Baptist, an ascetic and prophet who announces the coming of Christ.',
    },
  },
  {
    id: 'piece_06',
    index: 6,
    title: { it: 'San Pietro Martire', en: 'Saint Peter Martyr' },
    zone: 'upper',
    row: 'main',
    column: 6,
    correctIndex: 5,
    currentIndex: 5,
    puzzle: { src: puzzle6, width: 396, height: 1334 },
    audio: { it: '/audio/6_sanpietromartire.mp3', en: '/audio_eng/6_sanpietromartire_eng.mp3' },
    feedbackText: {
      it: 'Questa figura è San Pietro Martire, domenicano, simbolo di fede e martirio.',
      en: 'This figure is Saint Peter Martyr, a Dominican, a symbol of faith and martyrdom.',
    },
  },
  {
    id: 'piece_07',
    index: 7,
    title: { it: "Santa Caterina d'Alessandria", en: 'Saint Catherine of Alexandria' },
    zone: 'upper',
    row: 'main',
    column: 7,
    correctIndex: 6,
    currentIndex: 2,
    puzzle: { src: puzzle7, width: 393, height: 1327 },
    audio: { it: '/audio/7_santacaterina_giusto.mp3', en: '/audio_eng/7_santacaterina_giusto_eng.mp3' },
    feedbackText: {
      it: 'Questa figura è Santa Caterina d’Alessandria. La corona e il libro richiamano la sua sapienza e la sua origine regale, mentre la palma è simbolo del martirio. A lei è dedicato questo polittico.',
      en: 'This figure is Saint Catherine of Alexandria. The crown and the book evoke her wisdom and her royal origins, while the palm is a symbol of martyrdom. This polyptych is dedicated to her.',
    },
  },
  {
    id: 'piece_08',
    index: 8,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 1,
    correctIndex: 0,
    currentIndex: 2,
    puzzle: { src: puzzle8, width: 412, height: 333 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
  {
    id: 'piece_09',
    index: 9,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 2,
    correctIndex: 1,
    currentIndex: 5,
    puzzle: { src: puzzle9, width: 417, height: 325 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
  {
    id: 'piece_10',
    index: 10,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 3,
    correctIndex: 2,
    currentIndex: 0,
    puzzle: { src: puzzle10, width: 405, height: 337 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
  {
    id: 'piece_11',
    index: 11,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 4,
    correctIndex: 3,
    currentIndex: 6,
    puzzle: { src: puzzle11, width: 554, height: 327 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
  {
    id: 'piece_12',
    index: 12,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 5,
    correctIndex: 4,
    currentIndex: 1,
    puzzle: { src: puzzle12, width: 413, height: 327 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
  {
    id: 'piece_13',
    index: 13,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 6,
    correctIndex: 5,
    currentIndex: 4,
    puzzle: { src: puzzle13, width: 396, height: 323 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
  {
    id: 'piece_14',
    index: 14,
    title: predellaTitle,
    zone: 'predella',
    row: 'predella',
    column: 7,
    correctIndex: 6,
    currentIndex: 3,
    puzzle: { src: puzzle14, width: 409, height: 333 },
    audio: predellaAudio,
    feedbackText: predellaFeedbackText,
  },
]

export const upperPieces = puzzlePieces.filter((piece) => piece.zone === 'upper')
export const predellaPieces = puzzlePieces.filter((piece) => piece.zone === 'predella')
