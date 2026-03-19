import { T } from '../styles/tokens.js'
import { PlayingCard } from './PlayingCard.jsx'
import { ComboTag } from './ui.jsx'

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣']

export function PacketReveal({ group, winRate, pointEV, num, delay = 0, highlight = false }) {
  const pct      = winRate ?? 0
  const barColor = pct > 0.62 ? T.green : pct > 0.42 ? T.gold : T.red
  const accent   = T.combo[group.type] || T.t3

  return (
    <div style={{
      background:   highlight ? `${accent}0a` : T.s2,
      borderRadius: T.r3,
      border:       `1px solid ${highlight ? accent + '44' : T.b1}`,
      padding:      '13px 14px',
      position:     'relative',
      overflow:     'hidden',
      boxShadow:    highlight ? `0 0 24px ${accent}18` : 'none',
      animation:    `slideUp 0.3s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
    }}>
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 10, bottom: 10,
        width: 3, borderRadius: '0 3px 3px 0',
        background: accent,
        boxShadow: `0 0 10px ${accent}99`,
      }} />

      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 10, paddingLeft: 4,
      }}>
        <span style={{ fontSize: 16 }}>{MEDALS[num - 1]}</span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: T.t3,
          letterSpacing: '0.06em', textTransform: 'uppercase', flex: 1,
        }}>
          {num === 4 ? 'Packet 4 · 4-card' : `Packet ${num}`}
        </span>

        <ComboTag type={group.type} />

        {winRate !== undefined && (
          <span style={{
            fontSize: 16, fontWeight: 800,
            color: barColor, minWidth: 38, textAlign: 'right',
            fontFamily: T.display,
          }}>
            {Math.round(pct * 100)}%
          </span>
        )}
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex', gap: 5,
        marginBottom: winRate !== undefined ? 10 : 0,
        paddingLeft: 4,
      }}>
        {group.cards.map((c, i) => (
          <PlayingCard
            key={i} card={c} size="sm"
            dealDelay={delay + i * 0.045}
          />
        ))}
        {group.cards.length === 4 && (
          <div style={{
            fontSize: 10, color: T.t4,
            alignSelf: 'flex-end', marginLeft: 4,
            fontWeight: 600, lineHeight: 1.4,
          }}>
            4-card<br />group
          </div>
        )}
      </div>

      {/* Win bar */}
      {winRate !== undefined && (
        <>
          <div style={{
            height: 3, borderRadius: 99,
            background: 'rgba(255,255,255,0.05)',
            overflow: 'hidden', marginLeft: 4,
          }}>
            <div style={{
              height: '100%',
              width: `${pct * 100}%`,
              background: `linear-gradient(90deg, ${barColor}77, ${barColor})`,
              borderRadius: 99,
              boxShadow: `0 0 8px ${barColor}88`,
              transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>

          {pointEV !== undefined && (
            <div style={{
              fontSize: 10, color: T.t4,
              marginTop: 5, paddingLeft: 4,
              fontWeight: 500,
            }}>
              ~{Math.round(pointEV)}pts expected if won
            </div>
          )}
        </>
      )}
    </div>
  )
}
