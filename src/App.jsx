import { useState, useEffect, useRef } from 'react'
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

const FEEDBACK_FALLBACK_MS = 1800

function getInitialPositions() {
  return Object.fromEntries(puzzlePieces.map((piece) => [piece.id, piece.currentIndex]))
}

function getViewportSize() {
  if (window.visualViewport?.width && window.visualViewport?.height) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height,
    }
  }

  const width = window.innerWidth || document.documentElement.clientWidth
  const height = window.innerHeight || document.documentElement.clientHeight

  return { width, height }
}

function supportsForcedLandscapeFallback() {
  const iOSPlatform = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)
  const iPadOSDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  return iOSPlatform || iPadOSDesktopMode
}

function isViewportPortrait() {
  const canUseIOSOrientationAngle = (
    typeof navigator !== 'undefined'
    && supportsForcedLandscapeFallback()
    && typeof window.orientation !== 'undefined'
  )

  if (canUseIOSOrientationAngle) {
    const orientationAngle = window.orientation
    if (Math.abs(Number(orientationAngle)) === 90) return false
    if (Math.abs(Number(orientationAngle)) === 0 || Math.abs(Number(orientationAngle)) === 180) return true
  }

  if (window.matchMedia?.('(orientation: portrait)').matches) return true
  if (window.matchMedia?.('(orientation: landscape)').matches) return false

  const { width, height } = getViewportSize()
  return width < height
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
  const [feedback, setFeedback] = useState(null)
  const audioRef = useRef(null)
  const feedbackTimeoutRef = useRef(null)
  const predellaAudioPlayedRef = useRef(false)
  const activeTargetId = TARGET_SEQUENCE[targetIndex]
  const activeTarget = puzzlePieces.find((piece) => piece.id === activeTargetId)
  const isComplete = !activeTarget
  const feedbackActive = feedback !== null

  const clearFeedbackTimer = () => {
    if (!feedbackTimeoutRef.current) return
    window.clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = null
  }

  const stopCurrentAudio = () => {
    if (!audioRef.current) return
    audioRef.current.onended = null
    audioRef.current.onerror = null
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    audioRef.current = null
  }

  const finishFeedback = () => {
    clearFeedbackTimer()
    stopCurrentAudio()
    setFeedback(null)
  }

  const startFeedback = (piece) => {
    clearFeedbackTimer()
    stopCurrentAudio()

    const isPredellaFeedback = piece.zone === 'predella'
    const shouldPlayAudio = !isPredellaFeedback || !predellaAudioPlayedRef.current

    if (isPredellaFeedback) {
      predellaAudioPlayedRef.current = true
    }

    setFeedback({
      pieceId: piece.id,
      text: piece.feedbackText || piece.description,
      isPredella: isPredellaFeedback,
    })

    if (!shouldPlayAudio || !piece.audio) {
      feedbackTimeoutRef.current = window.setTimeout(finishFeedback, FEEDBACK_FALLBACK_MS)
      return
    }

    const audio = new Audio(piece.audio)
    audioRef.current = audio
    audio.onended = finishFeedback
    audio.onerror = finishFeedback

    const playPromise = audio.play()
    if (playPromise?.catch) {
      playPromise.catch(() => {
        feedbackTimeoutRef.current = window.setTimeout(finishFeedback, FEEDBACK_FALLBACK_MS)
      })
    }
  }

  useEffect(() => () => {
    clearFeedbackTimer()
    stopCurrentAudio()
  }, [])

  const handlePiecePress = (piece) => {
    if (feedbackActive) return

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
      startFeedback(piece)
    } else {
      setStatusMessage(`Questo non e il pezzo richiesto. Continua a cercare ${activeTarget.title}.`)
    }
  }

  return (
    <div className={`game-panel${feedbackActive ? ' game-panel--feedback-active' : ''}`}>
      <div className={`game-hud${isComplete ? ' game-hud--success' : ''}`} aria-live="polite">
        <div className="game-hud__body">
          <p className="game-hud__eyebrow">Ricostruisci il polittico</p>
          <p className="game-hud__target">
            {isComplete ? 'Completato' : 'Trova:'} <strong>{isComplete ? 'Polittico ricomposto' : activeTarget.title}</strong>
          </p>
          <p className="game-hud__status">{statusMessage}</p>
          <p className="game-hud__progress">{lockedPieces.length} / {puzzlePieces.length} pezzi corretti</p>
        </div>
        {feedback && (
          <div className="piece-feedback" role="status" aria-live="assertive">
            <p className="piece-feedback__text">{feedback.text}</p>
            <button
              type="button"
              className="piece-feedback__skip"
              onClick={finishFeedback}
            >
              Salta / Continua
            </button>
          </div>
        )}
        <button
          type="button"
          className="game-hud__back"
          onClick={onBack}
        >
          Torna all'introduzione
        </button>
      </div>
      <div className="game-stage-column">
        <div
          className={`polittico-stage${feedback?.isPredella ? ' polittico-stage--predella-feedback' : ''}`}
          id="polittico-stage"
          aria-label="Area polittico"
          aria-busy={feedbackActive}
        >
          <div
            className="polyptych-layout"
            aria-label="Polittico con quattordici pezzi puzzle"
          >
            {!isComplete && !feedbackActive && (
              <div
                className={`polyptych-piece polyptych-piece--target-frame polyptych-piece--${activeTarget.row} ${getSlotClass(activeTarget, activeTarget.correctIndex)}`}
                aria-hidden="true"
              />
            )}
            {puzzlePieces.map((piece) => {
              const solved = lockedPieces.includes(piece.id)
              const target = !isComplete && piece.id === activeTarget.id
              const feedbackPiece = feedback?.pieceId === piece.id
              const slotPiece = getSlotPiece(piece, positions[piece.id])
              const slotVisualIndex = slotPiece?.index ?? piece.index
              return (
                <button
                  key={`puzzle-${piece.id}`}
                  type="button"
                  className={`polyptych-piece polyptych-piece--puzzle-button polyptych-piece--${piece.row} ${getSlotClass(piece, positions[piece.id])}${solved ? ' polyptych-piece--locked' : ''}${target ? ' polyptych-piece--target' : ''}${feedbackPiece ? ' polyptych-piece--feedback' : ''}`}
                  onClick={() => handlePiecePress(piece)}
                  disabled={solved || feedbackActive}
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
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [isPortrait, setIsPortrait] = useState(
    () => typeof window !== 'undefined' && isViewportPortrait(),
  )
  const [forceLandscape, setForceLandscape] = useState(false)
  const [canForceLandscape] = useState(
    () => typeof navigator !== 'undefined' && supportsForcedLandscapeFallback(),
  )
  const forcedLandscapeActive = forceLandscape && canForceLandscape

  useEffect(() => {
    if (screen !== 'experience') return

    const update = () => {
      const nextIsPortrait = isViewportPortrait()
      setIsPortrait(nextIsPortrait)
      if (!nextIsPortrait) setForceLandscape(false)
    }
    const updateAfterViewportSettles = () => {
      update()
      requestAnimationFrame(update)
      window.setTimeout(update, 120)
      window.setTimeout(update, 360)
    }
    const portraitQuery = window.matchMedia?.('(orientation: portrait)')
    const landscapeQuery = window.matchMedia?.('(orientation: landscape)')

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', updateAfterViewportSettles)
    window.visualViewport?.addEventListener('resize', update)
    portraitQuery?.addEventListener('change', update)
    landscapeQuery?.addEventListener('change', update)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', updateAfterViewportSettles)
      window.visualViewport?.removeEventListener('resize', update)
      portraitQuery?.removeEventListener('change', update)
      landscapeQuery?.removeEventListener('change', update)
    }
  }, [screen])

  if (screen === 'experience' && isPortrait && !forcedLandscapeActive) {
    return (
      <div className="app app--experience app--experience--portrait">
        <header className="experience-bar">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              setForceLandscape(false)
              setScreen('intro')
            }}
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
          {canForceLandscape && (
            <button
              type="button"
              className="btn btn--secondary experience-portrait__continue"
              onClick={() => setForceLandscape(true)}
            >
              Ho ruotato, continua
            </button>
          )}
        </div>
      </div>
    )
  }

  if (screen === 'experience' && (!isPortrait || forcedLandscapeActive)) {
    return (
      <div className={`app app--experience app--experience--landscape${forcedLandscapeActive ? ' app--experience--forced-landscape' : ''}`}>
        <div className="app__content app__content--column app__content--experience-wide">
          <PolitticoGame onBack={() => {
            setForceLandscape(false)
            setScreen('intro')
          }}
          />
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
              setForceLandscape(false)
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
