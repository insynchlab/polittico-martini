export const LANGUAGES = ['it', 'en']
export const DEFAULT_LANGUAGE = 'it'
export const LANGUAGE_STORAGE_KEY = 'polittico-lang'

export const LANGUAGE_LABELS = {
  it: 'Italiano',
  en: 'English',
}

export const ui = {
  it: {
    introKicker: 'Esperienza interattiva',
    introTitle: 'Ricostruisci il Polittico di Santa Caterina',
    introLede:
      "Un'opera smembrata nel tempo torna leggibile attraverso i suoi pannelli, la predella e il ritmo originario della composizione.",
    introStepsLabel: 'Come funziona',
    introStep1: 'Osserva la sagoma del polittico',
    introStep2: 'Trova il pannello evidenziato',
    introStep3: "Ricomponi l'opera pezzo dopo pezzo",
    languageLabel: 'Lingua',
    loaderLabel: 'Caricamento immagini esperienza',
    loaderReady: 'Esperienza pronta',
    loaderPreparing: (progress) => `Preparazione esperienza... ${progress}%`,
    ctaReady: "Inizia l'esperienza",
    ctaLoading: 'Caricamento esperienza...',
    introNote: "Dopo l'avvio, ruota il dispositivo in orizzontale",
    iosFullscreenHint: "Su iPhone, per lo schermo intero: tocca Condividi e poi “Aggiungi alla schermata Home”.",
    backToIntro: "Torna all'introduzione",
    rotateMessage: 'Ruota il dispositivo in orizzontale per continuare',
    rotateIconTitle: 'Ruota in orizzontale',
    rotatedContinue: 'Ho ruotato, continua',
    gameInitialStatus: 'Tocca il pezzo richiesto per portarlo nello slot evidenziato.',
    feedbackSkip: 'Salta / Continua',
    gameEyebrow: 'Ricostruisci il polittico',
    gameFind: 'Trova:',
    gameCompletedLabel: 'Completato',
    gameCompletedStrong: 'Polittico ricomposto',
    gameProgress: (locked, total) => `${locked} / ${total} pezzi corretti`,
    musicOn: 'Musica on',
    musicOff: 'Musica off',
    ariaPolitticoArea: 'Area polittico',
    ariaPolitticoLayout: 'Polittico con quattordici pezzi puzzle',
    ariaActiveTarget: 'target attivo',
    statusComplete: 'Opera ricomposta: tutti i pezzi sono nella posizione corretta.',
    statusWrongZone: (zone) =>
      `Il target è nella ${zone === 'upper' ? 'riga superiore' : 'predella'}: usa solo quei pezzi.`,
    statusAlreadySolved: 'Questa posizione è già risolta e non può essere modificata.',
    statusPlacedNext: (placed, next) => `${placed} collocato correttamente. Ora cerca ${next}.`,
    statusKeepLooking: (target) => `Questo non è il pezzo richiesto. Continua a cercare ${target}.`,
  },
  en: {
    introKicker: 'Interactive experience',
    introTitle: 'Rebuild the Polyptych of Saint Catherine',
    introLede:
      'A work dismembered over time becomes legible again through its panels, the predella and the original rhythm of the composition.',
    introStepsLabel: 'How it works',
    introStep1: 'Observe the outline of the polyptych',
    introStep2: 'Find the highlighted panel',
    introStep3: 'Reassemble the work piece by piece',
    languageLabel: 'Language',
    loaderLabel: 'Loading experience images',
    loaderReady: 'Experience ready',
    loaderPreparing: (progress) => `Preparing experience... ${progress}%`,
    ctaReady: 'Start the experience',
    ctaLoading: 'Loading experience...',
    introNote: 'After starting, rotate your device to landscape',
    iosFullscreenHint: 'On iPhone, for full screen: tap Share, then “Add to Home Screen”.',
    backToIntro: 'Back to the introduction',
    rotateMessage: 'Rotate your device to landscape to continue',
    rotateIconTitle: 'Rotate to landscape',
    rotatedContinue: "I've rotated, continue",
    gameInitialStatus: 'Tap the requested piece to move it into the highlighted slot.',
    feedbackSkip: 'Skip / Continue',
    gameEyebrow: 'Rebuild the polyptych',
    gameFind: 'Find:',
    gameCompletedLabel: 'Completed',
    gameCompletedStrong: 'Polyptych reassembled',
    gameProgress: (locked, total) => `${locked} / ${total} correct pieces`,
    musicOn: 'Music on',
    musicOff: 'Music off',
    ariaPolitticoArea: 'Polyptych area',
    ariaPolitticoLayout: 'Polyptych with fourteen puzzle pieces',
    ariaActiveTarget: 'active target',
    statusComplete: 'Work reassembled: all pieces are in the correct position.',
    statusWrongZone: (zone) =>
      `The target is in the ${zone === 'upper' ? 'upper row' : 'predella'}: use only those pieces.`,
    statusAlreadySolved: 'This position is already solved and cannot be changed.',
    statusPlacedNext: (placed, next) => `${placed} placed correctly. Now look for ${next}.`,
    statusKeepLooking: (target) => `This is not the requested piece. Keep looking for ${target}.`,
  },
}

export function getUi(lang) {
  return ui[lang] || ui[DEFAULT_LANGUAGE]
}
