import { useState, useLayoutEffect } from 'react'
import './App.css'

function isViewportPortrait() {
  return window.innerWidth < window.innerHeight
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
        <div className="experience-portrait__inner">
          <p className="experience-portrait__message" role="status">
            Ruota il dispositivo in orizzontale per continuare
          </p>
          <span className="experience-portrait__icon" aria-hidden="true" title="Ruota in orizzontale">
            ↻
          </span>
        </div>
        <div className="app__actions app__actions--footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setScreen('intro')}
          >
            Torna all’introduzione
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'experience' && !isPortrait) {
    return (
      <div className="app app--experience app--experience--landscape">
        <div className="app__content app__content--column app__content--experience-wide">
          <h1 className="app__title">Area esperienza interattiva</h1>
          <p className="app__lede app__lede--center">Schermata landscape attiva</p>
          <div className="polittico-stage" id="polittico-stage" aria-label="Area polittico" />
          <div className="app__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setScreen('intro')}
            >
              Torna all’introduzione
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app app--intro">
      <div className="app__content app__content--column">
        <h1 className="app__title">Ricostruisci il Polittico di Santa Caterina</h1>
        <p className="app__lede">
          Questo polittico medievale è stato smembrato nel tempo. Riuscirai a
          ricostruire l’opera nella sua forma originale?
        </p>
        <ul className="intro__list" aria-label="Come funziona">
          <li>Sposta i pannelli</li>
          <li>Trova la posizione corretta</li>
          <li>Ascolta la storia delle figure</li>
        </ul>
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
          <p className="intro__note">Ruota il dispositivo per giocare</p>
        </div>
      </div>
    </div>
  )
}
