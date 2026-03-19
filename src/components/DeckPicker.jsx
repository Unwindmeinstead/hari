import { T } from '../styles/tokens.js'
import { RANKS, SUITS, IS_RED } from '../engine/cards.js'
import { cid } from '../engine/cards.js'
import { PlayingCard } from './PlayingCard.jsx'
import { SuitIcon } from './SuitIcon.jsx'

export function DeckPicker({ title, selected = [], blocked = [], onToggle, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 700,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          flex: 1,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        background: T.s1,
        borderRadius: `${T.r5}px ${T.r5}px 0 0`,
        border: `1px solid ${T.b2}`,
        borderBottom: 'none',
        maxHeight: '84dvh',
        display: 'flex',
        flexDirection: 'column',
        animation: 'sheetUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        overflow: 'hidden',
        boxShadow: '0 -24px 60px rgba(0,0,0,0.85)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 42, height: 4, borderRadius: 2, background: T.s5 }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '8px 18px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${T.b1}`,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.t1 }}>{title}</div>
            <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>
              {selected.length} selected
            </div>
          </div>
          <button onClick={onClose} style={{
            background: T.cyan, color: '#000', border: 'none',
            borderRadius: T.r2, padding: '9px 18px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: T.body,
            boxShadow: `0 0 18px ${T.cyan}44`,
          }}>Done</button>
        </div>

        {/* Card grid */}
        <div style={{ overflowY: 'auto', padding: '12px 16px 36px' }}>
          {SUITS.map(s => {
            const isRed = IS_RED.has(s)
            return (
              <div key={s} style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 8,
                }}>
                  <SuitIcon suit={s} size={12} />
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: isRed ? T.cardRed : 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {s === 'S' ? 'Spades' : s === 'H' ? 'Hearts' : s === 'D' ? 'Diamonds' : 'Clubs'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {RANKS.map(r => {
                    const card  = { r, s }
                    const id    = cid(card)
                    const isSel = selected.includes(id)
                    const isBlk = blocked.includes(id) && !isSel
                    return (
                      <PlayingCard
                        key={id} card={card} size="sm"
                        selected={isSel} dimmed={isBlk}
                        dealDelay={-1}
                        onClick={() => !isBlk && onToggle(card)}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
