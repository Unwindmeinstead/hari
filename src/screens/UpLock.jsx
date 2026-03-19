import { useState } from 'react'
import { T } from '../styles/tokens.js'
import { PlayingCard } from '../components/PlayingCard.jsx'
import { haptic } from '../components/ui.jsx'

export function UpLock({ G, onConfirm, onBack }) {
  const [locked, setLocked] = useState(false)

  const handleLock = () => {
    setLocked(true)
    haptic([20, 10, 20])
    setTimeout(() => onConfirm(), 900)
  }

  return (
    <div style={{
      minHeight: '100dvh', background: T.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
      position: 'relative', overflow: 'hidden',
      animation: 'fadeIn 0.22s ease',
    }}>
      {/* Ambient */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${T.purple}07 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Back */}
      {!locked && (
        <button onClick={onBack} style={{ position: 'absolute', top: 'max(16px,env(safe-area-inset-top,16px))', left: 18, background: 'none', border: 'none', color: T.t3, cursor: 'pointer', fontSize: 14, fontFamily: T.body, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width={7} height={12} viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back
        </button>
      )}

      {/* Hand display — fan */}
      <div style={{
        position: 'relative', width: 280, height: 120,
        marginBottom: 40,
        animation: locked ? 'lockSlam 0.5s ease' : 'none',
      }}>
        {G.yourCards.slice(0, 13).map((c, i) => {
          const total = Math.min(13, G.yourCards.length)
          const spread = 180
          const angle  = total > 1 ? (i / (total - 1)) * spread - spread / 2 : 0
          const rad    = angle * Math.PI / 180
          const xOff   = Math.sin(rad) * 80
          const yOff   = (1 - Math.cos(Math.abs(rad))) * 30
          return (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `translate(-50%,-50%) translateX(${xOff}px) translateY(${yOff}px) rotate(${angle * 0.6}deg)`,
              transformOrigin: 'bottom center',
              zIndex: i,
              transition: locked ? `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.02}s` : 'none',
              ...(locked ? { transform: `translate(-50%,-50%) translateX(${(i - 6) * 2}px) translateY(${i * 1}px) rotate(${(i - 6) * 0.5}deg)` } : {}),
            }}>
              <PlayingCard card={c} size="xs" dealDelay={i * 0.03} />
            </div>
          )
        })}
      </div>

      {/* Lock state */}
      {locked ? (
        <div style={{ textAlign: 'center', animation: 'scaleIn 0.3s ease' }}>
          <div style={{ fontSize: 52, marginBottom: 12, animation: 'chipBounce 0.5s ease' }}>🔒</div>
          <div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 900, color: T.cyan, letterSpacing: '0.1em', textShadow: `0 0 30px ${T.cyan}88` }}>
            LOCKED
          </div>
          <div style={{ fontSize: 13, color: T.t3, marginTop: 8 }}>Analysing your hand…</div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: 32, animation: 'slideUp 0.4s ease 0.1s both' }}>
            <div style={{ fontFamily: T.display, fontSize: 26, fontWeight: 900, color: T.t1, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Your {G.yourCards.length} cards
            </div>
            <div style={{ fontSize: 14, color: T.t2, lineHeight: 1.7, maxWidth: 260 }}>
              Once you're <span style={{ color: T.cyan, fontWeight: 700 }}>Up</span>, your split is locked.<br />
              No changes after this.
            </div>
          </div>

          {/* The ritual button */}
          <button onClick={handleLock} style={{
            background: `linear-gradient(135deg, ${T.purple}, #7C3AED)`,
            border: 'none',
            borderRadius: T.r4,
            padding: '20px 48px',
            fontSize: 20,
            fontWeight: 900,
            fontFamily: T.display,
            color: '#fff',
            cursor: 'pointer',
            letterSpacing: '0.08em',
            boxShadow: `0 0 40px ${T.purple}55, 0 8px 32px rgba(0,0,0,0.7)`,
            animation: 'slideUp 0.4s ease 0.2s both',
            transition: 'transform 0.1s',
          }}>
            🤚  I'M UP
          </button>

          <div style={{ fontSize: 11, color: T.t4, marginTop: 20, textAlign: 'center', animation: 'slideUp 0.4s ease 0.3s both' }}>
            Tap to lock your hand and proceed
          </div>
        </>
      )}
    </div>
  )
}
