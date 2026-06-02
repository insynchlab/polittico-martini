import { useState, useEffect, useRef } from 'react'
import { puzzlePieces } from './data/panels'
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_LABELS,
  getUi,
} from './data/i18n'
import './App.css'

function getInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const stored = window.localStorage?.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && LANGUAGES.includes(stored)) return stored

  const browserLang = navigator.language?.slice(0, 2)
  if (browserLang && LANGUAGES.includes(browserLang)) return browserLang

  return DEFAULT_LANGUAGE
}

const FLAGS = {
  it: (
    <svg viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect width="1" height="2" x="0" fill="#009246" />
      <rect width="1" height="2" x="1" fill="#ffffff" />
      <rect width="1" height="2" x="2" fill="#ce2b37" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" aria-hidden="true" focusable="false">
      <clipPath id="flag-en-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#flag-en-clip)"
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  ),
}

function LanguageToggle({ language, onChange, label }) {
  return (
    <div className="language-toggle" role="group" aria-label={label}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={`language-toggle__flag${language === code ? ' language-toggle__flag--active' : ''}`}
          onClick={() => onChange(code)}
          aria-pressed={language === code}
          aria-label={LANGUAGE_LABELS[code]}
          title={LANGUAGE_LABELS[code]}
        >
          <span className="language-toggle__icon">{FLAGS[code]}</span>
          <span className="language-toggle__code">{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}

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
const BACKGROUND_MUSIC_SRC = '/ChurchChill.mp3'
const BACKGROUND_MUSIC_VOLUME = 0.045
const BACKGROUND_MUSIC_DUCKED_VOLUME = 0.008
const EXPERIENCE_ASSET_COUNT = puzzlePieces.length

function createAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  return AudioContextClass ? new AudioContextClass() : null
}

function getInitialPositions() {
  return Object.fromEntries(puzzlePieces.map((piece) => [piece.id, piece.currentIndex]))
}

function preloadPuzzleImage(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onerror = () => resolve()
    image.src = src

    if (image.decode) {
      image.decode().then(resolve).catch(resolve)
    } else {
      image.onload = () => resolve()
    }
  })
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

function shouldShowIOSInstallHint() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false

  const isIPhoneLike = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)
  const isIPadOSDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  const isIOS = isIPhoneLike || isIPadOSDesktopMode
  if (!isIOS) return false

  const isStandalone = (
    window.navigator.standalone === true
    || window.matchMedia?.('(display-mode: standalone)').matches
  )

  return !isStandalone
}

function supportsForcedLandscapeFallback() {
  const iOSPlatform = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)
  const iPadOSDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  const androidPlatform = navigator.userAgentData?.platform === 'Android'
  const androidUserAgent = /Android/i.test(navigator.userAgent)

  return iOSPlatform || iPadOSDesktopMode || androidPlatform || androidUserAgent
}

function requestAppFullscreen() {
  if (typeof document === 'undefined') return

  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (fullscreenElement) return

  const element = document.documentElement
  const requestFullscreen = element.requestFullscreen || element.webkitRequestFullscreen
  if (!requestFullscreen) return

  const fullscreenRequest = requestFullscreen.call(element, { navigationUI: 'hide' })
  fullscreenRequest?.catch?.(() => {})
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

function PolitticoGame({
  lang,
  onBack,
  musicEnabled,
  onToggleMusic,
  onNarrationStart,
  onNarrationEnd,
}) {
  const t = getUi(lang)
  const [positions, setPositions] = useState(getInitialPositions)
  const [lockedPieces, setLockedPieces] = useState([])
  const [targetIndex, setTargetIndex] = useState(0)
  const [statusMessage, setStatusMessage] = useState(() => getUi(lang).gameInitialStatus)
  const [feedback, setFeedback] = useState(null)
  const audioRef = useRef(null)
  const moveAudioContextRef = useRef(null)
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

  const playMoveSound = () => {
    if (typeof window === 'undefined') return

    const audioContext = moveAudioContextRef.current || createAudioContext()
    if (!audioContext) return

    moveAudioContextRef.current = audioContext

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {})
    }

    const now = audioContext.currentTime
    const master = audioContext.createGain()
    const compressor = audioContext.createDynamicsCompressor()
    master.gain.setValueAtTime(0.95, now)
    compressor.threshold.setValueAtTime(-18, now)
    compressor.knee.setValueAtTime(18, now)
    compressor.ratio.setValueAtTime(8, now)
    compressor.attack.setValueAtTime(0.002, now)
    compressor.release.setValueAtTime(0.12, now)
    master.connect(compressor).connect(audioContext.destination)

    const woodBody = audioContext.createOscillator()
    const woodBodyGain = audioContext.createGain()
    const woodBodyFilter = audioContext.createBiquadFilter()
    woodBody.type = 'triangle'
    woodBody.frequency.setValueAtTime(210, now)
    woodBody.frequency.exponentialRampToValueAtTime(128, now + 0.08)
    woodBodyFilter.type = 'bandpass'
    woodBodyFilter.frequency.setValueAtTime(520, now)
    woodBodyFilter.Q.setValueAtTime(1.1, now)
    woodBodyGain.gain.setValueAtTime(0.0001, now)
    woodBodyGain.gain.exponentialRampToValueAtTime(0.24, now + 0.006)
    woodBodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)
    woodBody.connect(woodBodyFilter).connect(woodBodyGain).connect(master)
    woodBody.start(now)
    woodBody.stop(now + 0.15)

    const metalFilter = audioContext.createBiquadFilter()
    const metalGain = audioContext.createGain()
    metalFilter.type = 'bandpass'
    metalFilter.frequency.setValueAtTime(1750, now)
    metalFilter.Q.setValueAtTime(4.4, now)
    metalGain.gain.setValueAtTime(0.0001, now)
    metalGain.gain.exponentialRampToValueAtTime(0.072, now + 0.01)
    metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    metalFilter.connect(metalGain).connect(master)

    ;[587, 845].forEach((frequency) => {
      const overtone = audioContext.createOscillator()
      overtone.type = 'triangle'
      overtone.frequency.setValueAtTime(frequency, now)
      overtone.connect(metalFilter)
      overtone.start(now)
      overtone.stop(now + 0.2)
    })

    const noiseLength = Math.floor(audioContext.sampleRate * 0.035)
    const noiseBuffer = audioContext.createBuffer(1, noiseLength, audioContext.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let index = 0; index < noiseLength; index += 1) {
      noiseData[index] = (Math.random() * 2 - 1) * (1 - index / noiseLength)
    }

    const noise = audioContext.createBufferSource()
    const noiseFilter = audioContext.createBiquadFilter()
    const noiseGain = audioContext.createGain()
    noise.buffer = noiseBuffer
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(1150, now)
    noiseFilter.Q.setValueAtTime(1.35, now)
    noiseGain.gain.setValueAtTime(0.0001, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.085, now + 0.002)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)
    noise.connect(noiseFilter).connect(noiseGain).connect(master)
    noise.start(now)
    noise.stop(now + 0.05)
  }

  const finishFeedback = () => {
    clearFeedbackTimer()
    stopCurrentAudio()
    setFeedback(null)
    onNarrationEnd()
  }

  const startFeedback = (piece) => {
    clearFeedbackTimer()
    stopCurrentAudio()
    onNarrationStart()

    const isPredellaFeedback = piece.zone === 'predella'
    const shouldPlayAudio = !isPredellaFeedback || !predellaAudioPlayedRef.current

    if (isPredellaFeedback) {
      predellaAudioPlayedRef.current = true
    }

    const pieceAudio = piece.audio?.[lang]

    setFeedback({
      pieceId: piece.id,
      text: piece.feedbackText[lang],
      isPredella: isPredellaFeedback,
    })

    if (!shouldPlayAudio || !pieceAudio) {
      feedbackTimeoutRef.current = window.setTimeout(finishFeedback, FEEDBACK_FALLBACK_MS)
      return
    }

    const audio = new Audio(pieceAudio)
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
    moveAudioContextRef.current?.close()
  }, [])

  const handlePiecePress = (piece) => {
    if (feedbackActive) return

    if (isComplete) {
      setStatusMessage(t.statusComplete)
      return
    }

    if (lockedPieces.includes(piece.id)) return

    if (piece.zone !== activeTarget.zone) {
      setStatusMessage(t.statusWrongZone(activeTarget.zone))
      return
    }

    const targetSlot = activeTarget.correctIndex
    const clickedSlot = positions[piece.id]
    const targetSlotPiece = puzzlePieces.find(
      (candidate) => candidate.zone === activeTarget.zone && positions[candidate.id] === targetSlot,
    )

    if (!targetSlotPiece) return
    if (lockedPieces.includes(targetSlotPiece.id)) {
      setStatusMessage(t.statusAlreadySolved)
      return
    }

    setPositions((currentPositions) => ({
      ...currentPositions,
      [piece.id]: targetSlot,
      [targetSlotPiece.id]: clickedSlot,
    }))
    playMoveSound()

    if (piece.id === activeTarget.id) {
      const nextTargetIndex = targetIndex + 1
      const nextTarget = puzzlePieces.find((candidate) => candidate.id === TARGET_SEQUENCE[nextTargetIndex])
      setLockedPieces((currentLocked) => [...currentLocked, piece.id])
      setTargetIndex(nextTargetIndex)
      setStatusMessage(
        nextTarget
          ? t.statusPlacedNext(piece.title[lang], nextTarget.title[lang])
          : t.statusComplete,
      )
      startFeedback(piece)
    } else {
      setStatusMessage(t.statusKeepLooking(activeTarget.title[lang]))
    }
  }

  return (
    <div className={`game-panel${feedbackActive ? ' game-panel--feedback-active' : ''}`}>
      <div className={`game-hud${isComplete ? ' game-hud--success' : ''}${feedback ? ' game-hud--feedback' : ''}`} aria-live="polite">
        {feedback ? (
          <div className="piece-feedback" role="status" aria-live="assertive">
            <p className="piece-feedback__text">{feedback.text}</p>
            <button
              type="button"
              className="piece-feedback__skip"
              onClick={finishFeedback}
            >
              {t.feedbackSkip}
            </button>
          </div>
        ) : (
          <>
            <div className="game-hud__body">
              <p className="game-hud__eyebrow">{t.gameEyebrow}</p>
              <p className="game-hud__target">
                {isComplete ? t.gameCompletedLabel : t.gameFind} <strong>{isComplete ? t.gameCompletedStrong : activeTarget.title[lang]}</strong>
              </p>
              <p className="game-hud__status">{statusMessage}</p>
              <p className="game-hud__progress">{t.gameProgress(lockedPieces.length, puzzlePieces.length)}</p>
            </div>
            <button
              type="button"
              className="game-hud__back"
              onClick={onBack}
            >
              {t.backToIntro}
            </button>
            <button
              type="button"
              className="game-hud__music"
              onClick={onToggleMusic}
              aria-pressed={musicEnabled}
            >
              {musicEnabled ? t.musicOn : t.musicOff}
            </button>
          </>
        )}
      </div>
      <div className="game-stage-column">
        <div
          className={`polittico-stage${feedback?.isPredella ? ' polittico-stage--predella-feedback' : ''}`}
          id="polittico-stage"
          aria-label={t.ariaPolitticoArea}
          aria-busy={feedbackActive}
        >
          <div
            className="polyptych-layout"
            aria-label={t.ariaPolitticoLayout}
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
                  aria-label={`${piece.title[lang]}${target ? `, ${t.ariaActiveTarget}` : ''}`}
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
  const [language, setLanguage] = useState(getInitialLanguage)
  const t = getUi(language)
  const [isPortrait, setIsPortrait] = useState(
    () => typeof window !== 'undefined' && isViewportPortrait(),
  )
  const [forceLandscape, setForceLandscape] = useState(false)
  const [canForceLandscape] = useState(
    () => typeof navigator !== 'undefined' && supportsForcedLandscapeFallback(),
  )
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [showIOSInstallHint] = useState(shouldShowIOSInstallHint)
  const [loadedExperienceAssets, setLoadedExperienceAssets] = useState(0)
  const backgroundMusicRef = useRef(null)
  // La rotazione CSS forzata vale SOLO finche' il telefono e' fisicamente in
  // portrait. Appena ruoti davvero il telefono (isPortrait false) si disattiva
  // all'istante, evitando la "doppia rotazione" (CSS 90deg sommato a quella
  // fisica) che causava il glitch, senza dipendere dai tempi del reset async.
  const forcedLandscapeActive = forceLandscape && canForceLandscape && isPortrait
  const experienceReady = loadedExperienceAssets >= EXPERIENCE_ASSET_COUNT
  const preloadProgress = Math.round((loadedExperienceAssets / EXPERIENCE_ASSET_COUNT) * 100)

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
  }, [language])

  const getBackgroundMusic = () => {
    if (typeof window === 'undefined') return null

    if (!backgroundMusicRef.current) {
      const music = new Audio(BACKGROUND_MUSIC_SRC)
      music.loop = true
      music.preload = 'auto'
      music.volume = BACKGROUND_MUSIC_VOLUME
      backgroundMusicRef.current = music
    }

    return backgroundMusicRef.current
  }

  const playBackgroundMusic = (volume = BACKGROUND_MUSIC_VOLUME) => {
    const music = getBackgroundMusic()
    if (!music) return

    music.volume = volume
    music.play().catch(() => {})
  }

  const pauseBackgroundMusic = () => {
    backgroundMusicRef.current?.pause()
  }

  const duckBackgroundMusic = () => {
    if (!musicEnabled) return

    const music = getBackgroundMusic()
    if (!music || music.paused) return

    music.volume = BACKGROUND_MUSIC_DUCKED_VOLUME
  }

  const restoreBackgroundMusic = () => {
    if (!musicEnabled) return

    const music = getBackgroundMusic()
    if (!music) return

    music.volume = BACKGROUND_MUSIC_VOLUME
    if (screen === 'experience') {
      music.play().catch(() => {})
    }
  }

  const stopExperience = () => {
    setForceLandscape(false)
    setScreen('intro')
    pauseBackgroundMusic()
  }

  const startExperience = () => {
    requestAppFullscreen()
    setForceLandscape(false)
    setIsPortrait(isViewportPortrait())
    setScreen('experience')
    if (musicEnabled) playBackgroundMusic()
  }

  const toggleBackgroundMusic = () => {
    const nextMusicEnabled = !musicEnabled
    setMusicEnabled(nextMusicEnabled)

    if (nextMusicEnabled) {
      playBackgroundMusic()
    } else {
      pauseBackgroundMusic()
    }
  }

  useEffect(() => {
    let cancelled = false

    puzzlePieces.forEach((piece) => {
      preloadPuzzleImage(piece.puzzle.src).then(() => {
        if (cancelled) return
        setLoadedExperienceAssets((currentCount) => Math.min(currentCount + 1, EXPERIENCE_ASSET_COUNT))
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

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

  // Rete di sicurezza iOS: durante l'esperienza, il focus su un pezzo puo'
  // innescare uno scroll "porta in vista" su un contenitore residuo o sulla
  // finestra, spostando i pezzi in alto. Azzeriamo subito qualunque scroll.
  useEffect(() => {
    if (screen !== 'experience') return
    const killScroll = (event) => {
      const el = event.target
      if (el && el.nodeType === 1) {
        if (el.scrollTop) el.scrollTop = 0
        if (el.scrollLeft) el.scrollLeft = 0
      }
      if (window.scrollX || window.scrollY) window.scrollTo(0, 0)
    }
    window.addEventListener('scroll', killScroll, true)
    document.addEventListener('focusin', killScroll, true)
    return () => {
      window.removeEventListener('scroll', killScroll, true)
      document.removeEventListener('focusin', killScroll, true)
    }
  }, [screen])

  if (screen === 'experience' && isPortrait && !forcedLandscapeActive) {
    return (
      <div className="app app--experience app--experience--portrait">
        <header className="experience-bar">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={stopExperience}
          >
            {t.backToIntro}
          </button>
        </header>
        <div className="experience-portrait__inner">
          <p className="experience-portrait__message" role="status">
            {t.rotateMessage}
          </p>
          <span className="experience-portrait__icon" aria-hidden="true" title={t.rotateIconTitle}>
            ↻
          </span>
          {canForceLandscape && (
            <button
              type="button"
              className="btn btn--secondary experience-portrait__continue"
              onClick={() => setForceLandscape(true)}
            >
              {t.rotatedContinue}
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
          <PolitticoGame
            lang={language}
            onBack={stopExperience}
            musicEnabled={musicEnabled}
            onToggleMusic={toggleBackgroundMusic}
            onNarrationStart={duckBackgroundMusic}
            onNarrationEnd={restoreBackgroundMusic}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app app--intro">
      <div className="app__content app__content--column">
        <LanguageToggle
          language={language}
          onChange={changeLanguage}
          label={t.languageLabel}
        />
        <p className="intro__kicker">{t.introKicker}</p>
        <h1 className="app__title">{t.introTitle}</h1>
        <p className="app__lede">{t.introLede}</p>
        <div className="intro__divider" aria-hidden="true" />
        <ol className="intro__steps" aria-label={t.introStepsLabel}>
          <li className="intro__step">
            <span className="intro__step-index">01</span>
            <span className="intro__step-copy">{t.introStep1}</span>
          </li>
          <li className="intro__step">
            <span className="intro__step-index">02</span>
            <span className="intro__step-copy">{t.introStep2}</span>
          </li>
          <li className="intro__step">
            <span className="intro__step-index">03</span>
            <span className="intro__step-copy">{t.introStep3}</span>
          </li>
        </ol>
        <div
          className="intro-loader"
          aria-label={t.loaderLabel}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={preloadProgress}
          role="progressbar"
        >
          <div className="intro-loader__track">
            <div className="intro-loader__bar" style={{ width: `${preloadProgress}%` }} />
          </div>
          <p className="intro-loader__text">
            {experienceReady ? t.loaderReady : t.loaderPreparing(preloadProgress)}
          </p>
        </div>
        <div className="app__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={startExperience}
            disabled={!experienceReady}
          >
            {experienceReady ? t.ctaReady : t.ctaLoading}
          </button>
          <p className="intro__note">{t.introNote}</p>
          {showIOSInstallHint && (
            <p className="intro__ios-hint">{t.iosFullscreenHint}</p>
          )}
        </div>

        <footer className="intro-credits">
          <div className="intro-credits__divider" aria-hidden="true" />
          <ul className="intro-credits__logos" aria-label="Enti promotori">
            <li>
              <img src="/loghi/comune.png" alt="Comune di Pisa" loading="lazy" />
            </li>
            <li>
              <img src="/loghi/opa.png" alt="Opera della Primaziale Pisana" loading="lazy" />
            </li>
            <li>
              <img src="/loghi/musei_nazionali.png" alt="Musei Nazionali di Pisa" loading="lazy" />
            </li>
            <li>
              <img src="/loghi/pisa_turismo.png" alt="Pisa is Turismo" loading="lazy" />
            </li>
          </ul>
          <div className="intro-credits__funding">
            <p className="intro-credits__lead">Progetto finanziato a valere sui fondi</p>
            <p className="intro-credits__law">Legge 20 febbraio 2006, n. 77</p>
            <p className="intro-credits__quote">
              “Misure speciali di tutela e fruizione dei siti e degli elementi
              italiani di interesse culturale, paesaggistico e ambientale, inseriti
              nella “lista del patrimonio mondiale” posti sotto la tutela
              dell’UNESCO”
            </p>
            <img
              className="intro-credits__ministero"
              src="/loghi/ministero.png"
              alt="Ministero della Cultura"
              loading="lazy"
            />
          </div>
        </footer>
      </div>
    </div>
  )
}
