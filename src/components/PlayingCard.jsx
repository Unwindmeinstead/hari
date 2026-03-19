import { T } from '../styles/tokens.js'
import { IS_RED } from '../engine/cards.js'

const SYMS = { S:'♠', H:'♥', D:'♦', C:'♣' }

const SIZES = {
  xs: { w:32,  h:46,  r:5,  fr:8,  fs:8,  fc:14 },
  sm: { w:42,  h:60,  r:7,  fr:10, fs:10, fc:18 },
  md: { w:54,  h:76,  r:9,  fr:13, fs:13, fc:24 },
  lg: { w:68,  h:96,  r:11, fr:16, fs:16, fc:30 },
  xl: { w:82,  h:116, r:13, fr:19, fs:19, fc:38 },
}

export function PlayingCard({
  card,
  size       = 'md',
  selected   = false,
  dimmed     = false,
  faceDown   = false,
  dealDelay  = -1,   // -1 = no animation, >=0 = animate with this delay (seconds)
  floatDelay = -1,   // -1 = no float, >=0 = float with offset
  onClick,
  style      = {},
}) {
  const d = SIZES[size] || SIZES.md

  // Empty placeholder
  if (!card) return (
    <div onClick={onClick} style={{
      width: d.w, height: d.h, borderRadius: d.r, flexShrink: 0,
      border: `1.5px dashed ${T.b2}`,
      background: 'rgba(255,255,255,0.02)',
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      {onClick && <span style={{ fontSize: 20, color: T.t4 }}>+</span>}
    </div>
  )

  const isRed   = IS_RED.has(card.s)
  const color   = isRed ? T.cardRed : T.cardBlack
  const sym     = SYMS[card.s]

  // Back face
  if (faceDown) return (
    <div style={{
      width: d.w, height: d.h, borderRadius: d.r, flexShrink: 0,
      background: T.cardBack,
      border: `1px solid ${T.b2}`,
      boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      ...style,
    }} onClick={onClick}>
      <div style={{
        position: 'absolute', inset: 5, borderRadius: d.r - 3,
        border: '1px solid rgba(255,255,255,0.08)',
      }} />
      <span style={{ fontSize: d.fc * 0.6, opacity: 0.15, fontFamily: 'serif', color: '#fff' }}>♠</span>
    </div>
  )

  const animStyle = dealDelay >= 0 ? {
    animation: `cardDeal 0.34s cubic-bezier(0.22,1,0.36,1) ${dealDelay}s both`,
    '--dy': '-36px',
    '--dr': `${(Math.random() - 0.5) * 10}deg`,
  } : floatDelay >= 0 ? {
    animation: `floatCard 3.2s ease-in-out ${floatDelay}s infinite`,
    '--fr': `${(Math.random() - 0.5) * 8}deg`,
  } : {}

  return (
    <div
      onClick={onClick}
      style={{
        width: d.w, height: d.h, borderRadius: d.r, flexShrink: 0,
        background: dimmed
          ? 'linear-gradient(150deg,#1a1a1a,#111)'
          : T.cardFace,
        border: `1px solid ${selected
          ? T.cyan
          : dimmed
            ? T.b1
            : 'rgba(0,0,0,0.2)'}`,
        boxShadow: selected
          ? `0 0 0 2.5px ${T.cyan}, 0 0 22px rgba(0,229,255,0.3), 0 6px 24px rgba(0,0,0,0.9)`
          : dimmed
            ? 'none'
            : '0 1px 2px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.7), 0 8px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.85)',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        opacity: dimmed ? 0.22 : 1,
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3px 4px',
        transition: 'border 0.12s, box-shadow 0.12s, opacity 0.15s, transform 0.1s',
        transform: 'translateZ(0)',
        willChange: 'transform',
        ...animStyle,
        ...style,
      }}
    >
      {/* Top-left pip */}
      <div style={{
        color, fontWeight: 800, lineHeight: 1.05,
        fontFamily: T.body,
      }}>
        <div style={{ fontSize: d.fr, letterSpacing: '-0.03em' }}>{card.r}</div>
        <div style={{ fontSize: d.fs, marginTop: -2, fontFamily: 'Georgia,serif' }}>{sym}</div>
      </div>

      {/* Center suit watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: d.fc, color, opacity: 0.1,
        fontFamily: 'Georgia,serif', lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none',
      }}>{sym}</div>

      {/* Bottom-right pip (rotated 180°) */}
      <div style={{
        color, fontWeight: 800, lineHeight: 1.05,
        transform: 'rotate(180deg)', alignSelf: 'flex-end',
        fontFamily: T.body,
      }}>
        <div style={{ fontSize: d.fr, letterSpacing: '-0.03em' }}>{card.r}</div>
        <div style={{ fontSize: d.fs, marginTop: -2, fontFamily: 'Georgia,serif' }}>{sym}</div>
      </div>
    </div>
  )
}
