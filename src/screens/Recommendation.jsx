import { useState, useEffect } from 'react'
import { T } from '../styles/tokens.js'
import { WinGauge, ComboTag, Btn, ScoreRail, haptic } from '../components/ui.jsx'
import { PacketReveal } from '../components/PacketReveal.jsx'
import { generateInsight } from '../ai/groq.js'

export function Recommendation({ G, onNextHand, onUpdateScores, onNewMatch, onBack }) {
  const [altIdx, setAltIdx]     = useState(0)
  const [insight, setInsight]   = useState(null)
  const [loading, setLoading]   = useState(true)

  const res     = G.solverResult
  const cur     = res?.[altIdx] || res?.[0]
  const avgWin  = cur ? cur.winRates.reduce((s, w) => s + w, 0) / 4 : 0
  const seenCnt = G.seenOpp.reduce((s, o) => s + o.length, 0)
  const oppNames = G.players.slice(1).map(p => p.name)

  useEffect(() => {
    if (!res) return
    setLoading(true)
    setInsight(null)
    generateInsight(res, G.seenOpp, oppNames)
      .then(txt => { setInsight(txt); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!res || !cur) return null

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease' }}>

      {/* ── Sticky top block: safe-area + score rail + header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: T.s1,
        borderBottom: `1px solid ${T.b2}`,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        flexShrink: 0,
      }}>
        {/* Score rail */}
        <ScoreRail players={G.players} target={G.targetScore} dealerSeat={G.dealerSeat} />

        {/* Nav row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 8px' }}>
          <button onClick={onBack} style={{ background: T.s3, border: `1px solid ${T.b2}`, borderRadius: 10, color: T.t2, cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4, fontFamily: T.body, flexShrink: 0 }}>
            <svg width={6} height={10} viewBox="0 0 6 10" fill="none"><path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" /></svg>
            Seen cards
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: T.t4, fontWeight: 600 }}>
              Hand {G.handNum}{seenCnt > 0 ? ` · ${seenCnt} 👁` : ''}
            </span>
            <WinGauge value={avgWin} size="sm" />
          </div>
        </div>

        {/* Title + EV pills */}
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 900, color: T.t1, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 10 }}>
            Best Split
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ background: T.goldDim, border: `1px solid ${T.gold}33`, borderRadius: T.r2, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: T.gold, fontFamily: T.display, letterSpacing: '-0.04em', lineHeight: 1 }}>+{Math.round(cur.ev)}</span>
              <span style={{ fontSize: 10, color: T.t3, lineHeight: 1.4 }}>expected<br />pts</span>
            </div>
            <div style={{ background: T.greenDim, border: `1px solid ${T.green}33`, borderRadius: T.r2, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: T.green, fontFamily: T.display, letterSpacing: '-0.04em', lineHeight: 1 }}>{cur.winRates.filter(w => w > 0.5).length}/4</span>
              <span style={{ fontSize: 10, color: T.t3, lineHeight: 1.4 }}>packets<br />likely won</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

      {/* Alt split tabs */}
      {res.length > 1 && (
        <div style={{ display: 'flex', gap: 7, padding: '12px 16px 0' }}>
          {res.map((r, i) => (
            <button key={i} onClick={() => { setAltIdx(i); haptic([8]) }} style={{ flex: 1, padding: '10px 6px', borderRadius: T.r2, cursor: 'pointer', background: altIdx === i ? T.cyanDim : T.s2, color: altIdx === i ? T.cyan : T.t3, border: `1px solid ${altIdx === i ? T.cyan + '44' : T.b1}`, fontSize: 11, fontWeight: 700, boxShadow: altIdx === i ? `0 0 16px ${T.cyan}18` : 'none', transition: 'all 0.18s', fontFamily: T.body }}>
              <div>{i === 0 ? '★ BEST' : `ALT ${i}`}</div>
              <div style={{ fontSize: 9, marginTop: 2, opacity: 0.65 }}>+{Math.round(r.ev)}pts</div>
            </button>
          ))}
        </div>
      )}

      {/* Packet reveals */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {cur.split.map((g, i) => (
          <PacketReveal
            key={`${altIdx}-${i}`}
            group={g}
            winRate={cur.winRates[i]}
            pointEV={cur.pointEV?.[i]}
            num={i + 1}
            delay={i * 0.07}
            highlight={i === 0}
          />
        ))}
      </div>

      {/* AI Insight box */}
      <div style={{ margin: '0 16px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
          🧠 AI INSIGHT
        </div>
        <div style={{ background: T.s2, borderRadius: T.r3, border: `1px solid ${T.purple}33`, padding: '13px 15px', minHeight: 60, position: 'relative', boxShadow: `0 0 20px ${T.purple}0a` }}>
          {loading ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${T.purple}44`, borderTopColor: T.purple, animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.t3 }}>Generating tactical insight…</span>
            </div>
          ) : insight ? (
            <div style={{ fontSize: 13, color: T.t2, lineHeight: 1.72, animation: 'typeIn 0.5s ease' }}>
              <span style={{ color: T.purple, fontWeight: 700 }}>💡 </span>
              {insight}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: T.t4, fontStyle: 'italic' }}>
              Add your Groq API key to enable AI tactical insights.
            </div>
          )}
        </div>
      </div>

      {/* Combo reference */}
      <div style={{ margin: '0 16px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
          COMBO RANK (HIGH → LOW)
        </div>
        <div style={{ background: T.s2, borderRadius: T.r3, border: `1px solid ${T.b1}`, padding: '11px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 16px' }}>
          {[
            ['Troy', '3 of a kind'],
            ['Colour Run', 'Flush straight'],
            ['Run', 'Straight (A-2-3 = 2nd high)'],
            ['Colour', 'Same suit'],
            ['Pair', 'Two alike'],
            ['Indi', 'None of above'],
          ].map(([name, desc]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, lineHeight: 1.6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.combo[name] || T.t4, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, color: T.combo[name] || T.t3 }}>{name}</span>
              <span style={{ color: T.t4 }}>· {desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edge intelligence */}
      {seenCnt > 0 && (
        <div style={{ margin: '0 16px 12px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
            EDGE INTELLIGENCE APPLIED
          </div>
          <div style={{ background: T.s2, borderRadius: T.r3, border: `1px solid ${T.b1}`, padding: '10px 14px' }}>
            {G.seenOpp.map((o, i) => o.length > 0 && (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: i < G.seenOpp.length - 1 ? `1px solid ${T.b1}` : 'none' }}>
                <span style={{ fontSize: 13 }}>👁</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.t3, minWidth: 60 }}>{G.players[i + 1]?.name}</span>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {o.map((c, j) => (
                    <span key={j} style={{ fontSize: 11, fontWeight: 700, color: (c.s === 'H' || c.s === 'D') ? T.cardRed : T.t2, background: T.s4, borderRadius: 5, padding: '2px 6px' }}>
                      {c.r}{c.s === 'H' ? '♥' : c.s === 'D' ? '♦' : c.s === 'S' ? '♠' : '♣'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '4px 16px', paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Btn variant="ghost" color={T.t3} onPress={onBack} style={{ fontSize: 13, padding: '11px 16px' }}>
          ← Update seen cards & re-analyse
        </Btn>
        <Btn color={T.green} onPress={() => { haptic([15, 8, 15]); onNextHand() }} icon="🎲">
          NEXT HAND
        </Btn>
        <Btn variant="secondary" onPress={onUpdateScores} style={{ fontSize: 13, padding: '11px 16px' }}>
          Update Scores
        </Btn>
        <Btn variant="danger" onPress={onNewMatch} style={{ fontSize: 13, padding: '11px 16px' }}>
          New Match
        </Btn>
      </div>

      </div> {/* end scrollable body */}
    </div>
  )
}
