import { useState } from 'react'
import { T } from '../styles/tokens.js'
import { cid } from '../engine/cards.js'
import { FeltTable } from '../components/FeltTable.jsx'
import { PlayingCard } from '../components/PlayingCard.jsx'
import { DeckPicker } from '../components/DeckPicker.jsx'
import { Btn, haptic } from '../components/ui.jsx'

export function SeenCards({ G, upd, onAnalyse, onBack }) {
  const [picker, setPicker]     = useState(null) // oppIdx or null
  const [activeOpp, setActive]  = useState(null)

  const seenCounts = G.players.slice(1).map((_, i) => (G.seenOpp[i] || []).length)
  const totalSeen  = seenCounts.reduce((s, n) => s + n, 0)

  const toggleSeen = (oppIdx, card) => {
    const id  = cid(card)
    const so  = G.seenOpp.map(a => [...a])
    const cur = so[oppIdx] || []
    so[oppIdx] = cur.map(cid).includes(id)
      ? cur.filter(x => cid(x) !== id)
      : [...cur, card]
    upd({ seenOpp: so })
    haptic([8])
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease' }}>

      {/* Nav */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.b1}`, padding: '0 18px', paddingTop: 'env(safe-area-inset-top,0)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 52 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.cyan, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, fontFamily: T.body, padding: '0 8px 0 0' }}>
            <svg width={7} height={12} viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.t1 }}>Seen Cards</div>
            <div style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>
              {totalSeen > 0 ? `${totalSeen} card${totalSeen > 1 ? 's' : ''} logged — prediction sharpened` : 'Log cards you\'ve glimpsed'}
            </div>
          </div>
        </div>
      </div>

      {/* Felt table with opponent seats — tap to select */}
      <FeltTable
        players={G.players} playerCount={G.playerCount}
        yourSeat={G.yourSeat} dealerSeat={G.dealerSeat}
        seenCounts={[0, ...seenCounts]}
        onSeatTap={i => { if (i !== G.yourSeat) setActive(activeOpp === i ? null : i) }}
      />

      <div style={{ fontSize: 10, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginTop: -8, marginBottom: 12 }}>
        TAP OPPONENT SEAT TO LOG CARDS
      </div>

      {/* Opponent panels */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Info pill */}
        <div style={{ background: T.s2, borderRadius: T.r3, border: `1px solid ${T.b1}`, padding: '11px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>👁</span>
          <span style={{ fontSize: 13, color: T.t2, lineHeight: 1.65 }}>
            Each glimpsed card constrains opponent hand sampling. Even 1–2 cards shifts expected value meaningfully.
          </span>
        </div>

        {G.players.slice(1).map((p, i) => {
          const oSeen  = G.seenOpp[i] || []
          const isOpen = activeOpp === i + 1
          const accent = oSeen.length > 0 ? T.cyan : T.t3

          return (
            <div key={i} style={{
              background: T.s2, borderRadius: T.r3,
              border: `1px solid ${isOpen ? T.cyan + '44' : T.b1}`,
              overflow: 'hidden',
              boxShadow: isOpen ? `0 0 24px ${T.cyan}10` : 'none',
              transition: 'border 0.18s, box-shadow 0.18s',
            }}>
              {/* Header */}
              <div onClick={() => setActive(isOpen ? null : i + 1)} style={{ padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: T.r2, flexShrink: 0, background: isOpen ? T.cyan : T.s4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: isOpen ? '#000' : T.t2, fontFamily: T.display, transition: 'all 0.18s', boxShadow: isOpen ? `0 0 14px ${T.cyan}55` : 'none' }}>
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: accent, marginTop: 1, fontWeight: 500 }}>
                    {oSeen.length > 0 ? `${oSeen.length} card${oSeen.length > 1 ? 's' : ''} logged` : 'Nothing seen yet'}
                  </div>
                </div>
                {oSeen.length > 0 && (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {oSeen.slice(0, 3).map((c, j) => <PlayingCard key={j} card={c} size="xs" dealDelay={-1} />)}
                    {oSeen.length > 3 && <div style={{ width: 32, height: 46, borderRadius: 5, background: T.s4, border: `1px solid ${T.b1}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: T.t3, fontWeight: 700 }}>+{oSeen.length - 3}</div>}
                  </div>
                )}
                <span style={{ color: isOpen ? T.cyan : T.t4, fontSize: 14, transition: 'transform 0.18s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div style={{ padding: '0 15px 14px', borderTop: `1px solid ${T.b1}`, animation: 'slideDown 0.2s ease' }}>
                  {oSeen.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12, marginBottom: 12 }}>
                      {oSeen.map((c, j) => (
                        <div key={j} style={{ position: 'relative' }}>
                          <PlayingCard card={c} size="sm" dealDelay={-1} />
                          <button onClick={() => toggleSeen(i, c)} style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: T.red, border: `2px solid ${T.bg}`, cursor: 'pointer', fontSize: 9, color: '#fff', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setPicker(i)} style={{ background: T.cyanDim, color: T.cyan, border: `1px solid ${T.cyan}33`, borderRadius: T.r2, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: oSeen.length ? 0 : 12, fontFamily: T.body }}>
                    + Add Card
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA dock */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: `${T.s1}ee`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${T.b1}`, padding: '12px 16px', paddingBottom: 'max(12px,env(safe-area-inset-bottom,12px))', display: 'flex', gap: 10 }}>
        <Btn variant="ghost" onPress={onAnalyse} style={{ flex: 0.75, fontSize: 14, padding: '12px 10px' }}>Skip</Btn>
        <Btn color={T.green} onPress={() => { haptic([15]); onAnalyse() }} icon="🧠" style={{ flex: 2 }}>
          Analyse Hand
        </Btn>
      </div>

      {picker !== null && (
        <DeckPicker
          title={`Seen in ${G.players[picker + 1]?.name}'s hand`}
          selected={(G.seenOpp[picker] || []).map(cid)}
          blocked={[...G.yourCards.map(cid), ...G.seenOpp.filter((_, j) => j !== picker).flat().map(cid)]}
          onToggle={c => toggleSeen(picker, c)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  )
}
