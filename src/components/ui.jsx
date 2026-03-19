import { T } from '../styles/tokens.js'

// ── Win Gauge ────────────────────────────────────────────
export function WinGauge({ value = 0, size = 'md' }) {
  const pct   = Math.min(1, Math.max(0, value))
  const color = pct < 0.33 ? T.red : pct < 0.62 ? T.gold : T.green
  const label = pct < 0.33 ? 'Tough' : pct < 0.62 ? 'Decent' : 'Strong'

  const W  = size === 'sm' ? 110 : 140
  const r  = size === 'sm' ? 38  : 50
  const cx = W / 2
  const cy = size === 'sm' ? 50 : 62
  const sw = size === 'sm' ? 8  : 10

  const ang = pct * 180
  const toXY = d => ({
    x: cx + r * Math.cos(d * Math.PI / 180),
    y: cy + r * Math.sin(d * Math.PI / 180),
  })
  const s  = toXY(180)
  const e  = toXY(180 + ang)
  const lg = ang > 180 ? 1 : 0

  const fs = size === 'sm' ? 20 : 26

  return (
    <div style={{ textAlign: 'center', lineHeight: 1 }}>
      <svg width={W} height={cy + 4} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)"
          strokeWidth={sw} strokeLinecap="round"
        />
        {/* Fill */}
        {pct > 0.005 && (
          <path
            d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`}
            fill="none" stroke={color}
            strokeWidth={sw} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 7px ${color}88)` }}
          />
        )}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={cx + (r - 11) * Math.cos((180 + ang) * Math.PI / 180)}
          y2={cy + (r - 11) * Math.sin((180 + ang) * Math.PI / 180)}
          stroke={T.t1} strokeWidth={2.5} strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill={T.t1} />
        {/* Tip glow */}
        {pct > 0.02 && (
          <circle cx={e.x} cy={e.y} r={4} fill={color}
            style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
        )}
      </svg>

      <div style={{
        fontSize: fs, fontWeight: 900, color,
        letterSpacing: '-0.04em', marginTop: 2,
        textShadow: `0 0 20px ${color}55`,
        fontFamily: T.display,
        animation: 'countUp 0.4s ease',
      }}>
        {Math.round(pct * 100)}%
      </div>
      <div style={{
        fontSize: 10, color: T.t3, marginTop: 3,
        fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>{label} Hand</div>
    </div>
  )
}

// ── Combo Tag ────────────────────────────────────────────
export function ComboTag({ type, size = 'sm' }) {
  const color  = T.combo[type]  || T.t3
  const dimBg  = T.comboDim[type] || 'rgba(255,255,255,0.04)'
  const fs     = size === 'lg' ? 13 : 11
  const pad    = size === 'lg' ? '4px 12px' : '3px 9px'
  return (
    <span style={{
      background: dimBg,
      color,
      border: `1px solid ${color}30`,
      borderRadius: T.r2,
      padding: pad,
      fontSize: fs,
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      fontFamily: T.body,
    }}>{type}</span>
  )
}

// ── Score Rail ───────────────────────────────────────────
export function ScoreRail({ players, target = 1000, dealerSeat = 0 }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      padding: '8px 14px 6px',
      background: T.s1,
      borderBottom: `1px solid ${T.b1}`,
      overflowX: 'auto',
    }}>
      {players.map((p, i) => {
        const pct   = Math.min(1, p.score / target)
        const color = pct > 0.9 ? T.red : pct > 0.65 ? T.gold : T.cyan
        const isD   = i === dealerSeat
        return (
          <div key={i} style={{ flex: 1, minWidth: 56 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              marginBottom: 3,
            }}>
              {isD && (
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: T.gold, flexShrink: 0,
                  boxShadow: `0 0 6px ${T.gold}99`,
                }} />
              )}
              <span style={{
                fontSize: 9, fontWeight: 700, color: T.t3,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{p.name.slice(0, 5)}</span>
            </div>
            <div style={{
              height: 3, borderRadius: 99,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct * 100}%`,
                background: color,
                borderRadius: 99,
                boxShadow: `0 0 6px ${color}66`,
                transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, color,
              marginTop: 3, fontFamily: T.display,
              animation: 'countUp 0.3s ease',
            }}>{p.score}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Buttons ──────────────────────────────────────────────
export function Btn({ children, onPress, variant = 'primary', color, disabled, icon, small, style = {} }) {
  const col = color || T.cyan
  const colDark = color ? color + '22' : T.cyanDim

  const vs = {
    primary:   { bg: col,           tc: '#000',  border: 'none',                        shadow: `0 0 28px ${col}33, 0 4px 16px rgba(0,0,0,0.7)` },
    secondary: { bg: T.s3,          tc: T.t1,    border: `1px solid ${T.b2}`,            shadow: '0 2px 8px rgba(0,0,0,0.5)' },
    ghost:     { bg: colDark,       tc: col,     border: `1px solid ${col}33`,           shadow: 'none' },
    danger:    { bg: T.redDim,      tc: T.red,   border: `1px solid rgba(255,68,88,0.25)`, shadow: 'none' },
    gold:      { bg: T.gold,        tc: '#000',  border: 'none',                         shadow: `0 0 28px ${T.gold}33` },
    green:     { bg: T.green,       tc: '#000',  border: 'none',                         shadow: `0 0 28px ${T.green}33` },
  }
  const v = vs[variant] || vs.primary

  return (
    <button
      onClick={disabled ? undefined : onPress}
      style={{
        background:    v.bg,
        color:         v.tc,
        border:        v.border,
        boxShadow:     v.shadow,
        borderRadius:  T.r3,
        padding:       small ? '11px 18px' : '14px 20px',
        fontSize:      small ? 13 : 15,
        fontWeight:    700,
        fontFamily:    T.body,
        cursor:        disabled ? 'not-allowed' : 'pointer',
        opacity:       disabled ? 0.32 : 1,
        width:         '100%',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
        gap:           8,
        letterSpacing: '-0.01em',
        transition:    'opacity 0.12s, transform 0.1s',
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: small ? 15 : 18, lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  )
}

// ── Haptic ───────────────────────────────────────────────
export function haptic(pattern = [10]) {
  try { navigator.vibrate?.(pattern) } catch {}
}
