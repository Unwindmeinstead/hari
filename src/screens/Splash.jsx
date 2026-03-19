import { T } from '../styles/tokens.js'
import { PlayingCard } from '../components/PlayingCard.jsx'
import { Btn } from '../components/ui.jsx'

const FAN_CARDS = [
  { r:'A', s:'S', rot:-26, tx:-72, ty:18, delay:0.00 },
  { r:'K', s:'H', rot:-13, tx:-34, ty:7,  delay:0.07 },
  { r:'Q', s:'D', rot:  0, tx:  6, ty:0,  delay:0.14 },
  { r:'J', s:'C', rot: 13, tx: 46, ty:7,  delay:0.21 },
  { r:'10',s:'H', rot: 26, tx: 84, ty:18, delay:0.28 },
]

export function Splash({ onNewMatch, onQuickHand }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: T.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-15%', left: '50%',
        transform: 'translateX(-50%)',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '8%', right: '-8%',
        width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.green}07 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '-10%',
        width: 240, height: 240, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.purple}06 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Card fan */}
      <div style={{
        position: 'relative',
        width: 240, height: 160,
        marginBottom: 44,
        flexShrink: 0,
      }}>
        {FAN_CARDS.map((fc, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: `translate(-50%,-50%) translateX(${fc.tx}px) translateY(${fc.ty}px) rotate(${fc.rot}deg)`,
            transformOrigin: 'bottom center',
            animation: `cardDeal 0.42s cubic-bezier(0.22,1,0.36,1) ${fc.delay}s both`,
            zIndex: i,
          }}>
            <PlayingCard card={{ r: fc.r, s: fc.s }} size="lg" dealDelay={-1} />
          </div>
        ))}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: T.display,
        fontSize: 54, fontWeight: 900,
        color: T.t1, letterSpacing: '-0.04em',
        lineHeight: 0.92, textAlign: 'center',
        animation: 'slideUp 0.5s ease 0.32s both',
      }}>
        HAZARI
      </div>

      <div style={{
        fontFamily: T.body,
        fontSize: 11, fontWeight: 700,
        color: T.cyan, letterSpacing: '0.3em',
        marginTop: 9, marginBottom: 6,
        textTransform: 'uppercase',
        textShadow: `0 0 22px ${T.cyan}88`,
        animation: 'slideUp 0.5s ease 0.38s both',
      }}>
        EDGE
      </div>

      <div style={{
        width: 32, height: 1,
        background: `linear-gradient(90deg, transparent, ${T.b3}, transparent)`,
        margin: '8px 0 16px',
        animation: 'slideUp 0.5s ease 0.40s both',
      }} />

      <div style={{
        fontSize: 14, color: T.t2, textAlign: 'center',
        lineHeight: 1.72, maxWidth: 260, marginBottom: 52,
        animation: 'slideUp 0.5s ease 0.44s both',
        fontWeight: 400,
      }}>
        Monte Carlo solver · Opponent prediction<br />
        Street-level hand intelligence
      </div>

      <div style={{
        width: '100%', maxWidth: 300,
        display: 'flex', flexDirection: 'column', gap: 11,
        animation: 'slideUp 0.5s ease 0.50s both',
      }}>
        <Btn onPress={onNewMatch} icon="🃏">NEW MATCH</Btn>
        <Btn variant="secondary" onPress={onQuickHand} icon="⚡">QUICK HAND</Btn>
      </div>

      <div style={{
        position: 'absolute', bottom: 28,
        fontSize: 10, color: T.t4,
        letterSpacing: '0.12em', fontWeight: 500,
        animation: 'fadeIn 1s ease 0.8s both',
      }}>
        HAZARI EDGE v2.0
      </div>
    </div>
  )
}
