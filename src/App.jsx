import { useState, useLayoutEffect } from 'react'
import { puzzlePieces } from './data/panels'
import './App.css'

const TARGET_SEQUENCE = [
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

function getInitialPositions() {
  return Object.fromEntries(puzzlePieces.map((piece) => [piece.id, piece.currentIndex]))
}

function isViewportPortrait() {
  return window.innerWidth < window.innerHeight
}

function getSlotClass(piece, slotIndex) {
  const visualIndex = piece.zone === 'upper' ? slotIndex + 1 : slotIndex + 8
  return `polyptych-piece--${visualIndex}`
}

function getSlotPiece(piece, slotIndex) {
  return puzzlePieces.find((candidate) => (
    candidate.zone === piece.zone && candidate.correctIndex === slotIndex
  ))
}

function PolitticoGame({ onBack }) {
  const [positions, setPositions] = useState(getInitialPositions)
  const [lockedPieces, setLockedPieces] = useState([])
  const [targetIndex, setTargetIndex] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Tocca il pezzo richiesto per portarlo nello slot evidenziato.')
  const activeTargetId = TARGET_SEQUENCE[targetIndex]
  const activeTarget = puzzlePieces.find((piece) => piece.id === activeTargetId)
  const isComplete = !activeTarget

  const handlePiecePress = (piece) => {
    if (isComplete) {
      setStatusMessage('Opera ricomposta: tutti i pezzi sono nella posizione corretta.')
      return
    }

    if (lockedPieces.includes(piece.id)) return

    if (piece.zone !== activeTarget.zone) {
      setStatusMessage(`Il target e nella ${activeTarget.zone === 'upper' ? 'riga superiore' : 'predella'}: usa solo quei pezzi.`)
      return
    }

    const targetSlot = activeTarget.correctIndex
    const clickedSlot = positions[piece.id]
    const targetSlotPiece = puzzlePieces.find(
      (candidate) => candidate.zone === activeTarget.zone && positions[candidate.id] === targetSlot,
    )

    if (!targetSlotPiece) return
    if (lockedPieces.includes(targetSlotPiece.id)) {
      setStatusMessage('Questa posizione e gia risolta e non puo essere modificata.')
      return
    }

    setPositions((currentPositions) => ({
      ...currentPositions,
      [piece.id]: targetSlot,
      [targetSlotPiece.id]: clickedSlot,
    }))

    if (piece.id === activeTarget.id) {
      const nextTargetIndex = targetIndex + 1
      const nextTarget = puzzlePieces.find((candidate) => candidate.id === TARGET_SEQUENCE[nextTargetIndex])
      setLockedPieces((currentLocked) => [...currentLocked, piece.id])
      setTargetIndex(nextTargetIndex)
      setStatusMessage(
        nextTarget
          ? `${piece.title} collocato correttamente. Ora cerca ${nextTarget.title}.`
          : 'Opera ricomposta: tutti i pezzi sono nella posizione corretta.',
      )
    } else {
      setStatusMessage(`Questo non e il pezzo richiesto. Continua a cercare ${activeTarget.title}.`)
    }
  }

  return (
    <div className="game-panel">
      <div className={`game-hud${isComplete ? ' game-hud--success' : ''}`} aria-live="polite">
        <div className="game-hud__body">
          <p className="game-hud__eyebrow">Ricostruisci il polittico</p>
          <p className="game-hud__target">
            {isComplete ? 'Completato' : 'Trova:'} <strong>{isComplete ? 'Polittico ricomposto' : activeTarget.title}</strong>
          </p>
          <p className="game-hud__status">{statusMessage}</p>
          <p className="game-hud__progress">{lockedPieces.length} / {puzzlePieces.length} pezzi corretti</p>
        </div>
        <button
          type="button"
          className="game-hud__back"
          onClick={onBack}
        >
          Torna all'introduzione
        </button>
      </div>
      <div className="polittico-stage" id="polittico-stage" aria-label="Area polittico">
        <div
          className="polyptych-layout"
          aria-label="Polittico con quattordici pezzi puzzle"
        >
          {!isComplete && (
            <div
              className={`polyptych-piece polyptych-piece--target-frame polyptych-piece--${activeTarget.row} ${getSlotClass(activeTarget, activeTarget.correctIndex)}`}
              aria-hidden="true"
            />
          )}
          {puzzlePieces.map((piece) => {
            const solved = lockedPieces.includes(piece.id)
            const target = !isComplete && piece.id === activeTarget.id
            const slotPiece = getSlotPiece(piece, positions[piece.id])
            const slotVisualIndex = slotPiece?.index ?? piece.index
            return (
              <button
                key={`puzzle-${piece.id}`}
                type="button"
                className={`polyptych-piece polyptych-piece--puzzle-button polyptych-piece--${piece.row} ${getSlotClass(piece, positions[piece.id])}${solved ? ' polyptych-piece--locked' : ''}${target ? ' polyptych-piece--target' : ''}`}
                onClick={() => handlePiecePress(piece)}
                disabled={solved}
                aria-label={`${piece.title}${target ? ', target attivo' : ''}`}
              >
                <img
                  className={`polyptych-piece__img polyptych-piece__img--puzzle polyptych-piece__img--slot-${slotVisualIndex}`}
                  src={piece.puzzle.src}
                  alt=""
                  width={piece.puzzle.width}
                  height={piece.puzzle.height}
                  decoding="async"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [isPortrait, setIsPortrait] = useState(
    () => typeof window !== 'undefined' && isViewportPortrait(),
  )

  useLayoutEffect(() => {
    if (screen !== 'experience') return

    const update = () => setIsPortrait(isViewportPortrait())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [screen])

  if (screen === 'experience' && isPortrait) {
    return (
      <div className="app app--experience app--experience--portrait">
        <header className="experience-bar">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setScreen('intro')}
          >
            Torna all’introduzione
          </button>
        </header>
        <div className="experience-portrait__inner">
          <p className="experience-portrait__message" role="status">
            Ruota il dispositivo in orizzontale per continuare
          </p>
          <span className="experience-portrait__icon" aria-hidden="true" title="Ruota in orizzontale">
            ↻
          </span>
        </div>
      </div>
    )
  }

  if (screen === 'experience' && !isPortrait) {
    return (
      <div className="app app--experience app--experience--landscape">
        <div className="app__content app__content--column app__content--experience-wide">
          <PolitticoGame onBack={() => setScreen('intro')} />
        </div>
      </div>
    )
  }

  return (
    <div className="app app--intro">
      <div className="app__content app__content--column">
        <p className="intro__kicker">Esperienza interattiva</p>
        <h1 className="app__title">Ricostruisci il Polittico di Santa Caterina</h1>
        <p className="app__lede">
          Un'opera smembrata nel tempo torna leggibile attraverso i suoi pannelli,
          la predella e il ritmo originario della composizione.
        </p>
        <div className="intro__divider" aria-hidden="true" />
        <ol className="intro__steps" aria-label="Come funziona">
          <li className="intro__step">
            <span className="intro__step-index">01</span>
            <span className="intro__step-copy">Osserva la sagoma del polittico</span>
          </li>
          <li className="intro__step">
            <span className="intro__step-index">02</span>
            <span className="intro__step-copy">Trova il pannello evidenziato</span>
          </li>
          <li className="intro__step">
            <span className="intro__step-index">03</span>
            <span className="intro__step-copy">Ricomponi l'opera pezzo dopo pezzo</span>
          </li>
        </ol>
        <div className="app__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setIsPortrait(isViewportPortrait())
              setScreen('experience')
            }}
          >
            Inizia l’esperienza
          </button>
          <p className="intro__note">Dopo l'avvio, ruota il dispositivo in orizzontale</p>
        </div>
      </div>
    </div>
  )
}
