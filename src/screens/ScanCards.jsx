import { useState, useRef, useEffect } from 'react'
import { T } from '../styles/tokens.js'
import { RANKS, SUITS, IS_RED, cid } from '../engine/cards.js'
import { PlayingCard } from '../components/PlayingCard.jsx'
import { DeckPicker } from '../components/DeckPicker.jsx'
import { Btn, haptic } from '../components/ui.jsx'
import { SuitIcon } from '../components/SuitIcon.jsx'

export function ScanCards({ G, upd, onNext, onBack }) {
  const [picker, setPicker]   = useState(false)
  const [camFail, setCamFail] = useState(false)
  const videoRef  = useRef(null)
  const streamRef = useRef(null)
  const cardIds   = G.yourCards.map(cid)
  const done      = G.yourCards.length === 13

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } })
      .then(s => { streamRef.current = s; if (videoRef.current) videoRef.current.srcObject = s; setCamFail(false) })
      .catch(() => setCamFail(true))
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  const toggleCard = (card) => {
    const id = cid(card)
    if (cardIds.includes(id)) {
      upd({ yourCards: G.yourCards.filter(x => cid(x) !== id) })
      haptic([6])
    } else if (G.yourCards.length < 13) {
      upd({ yourCards: [...G.yourCards, card] })
      haptic([10])
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column' }}>

      {/* Camera strip */}
      <div style={{ position: 'relative', height: 200, background: '#000', flexShrink: 0, overflow: 'hidden' }}>
        {!camFail
          ? <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
          : <div style={{ width: '100%', height: '100%', background: T.s1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 38 }}>📷</span>
              <span style={{ fontSize: 13, color: T.t2 }}>Camera unavailable — use grid below</span>
            </div>
        }

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 45%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Scan corner brackets */}
        {!camFail && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 180, height: 100 }}>
            {[['topleft','top:0,left:0','borderTop,borderLeft'],['topright','top:0,right:0','borderTop,borderRight'],['btmleft','bottom:0,left:0','borderBottom,borderLeft'],['btmright','bottom:0,right:0','borderBottom,borderRight']].map(([k, pos, bords]) => {
              const styles = {}
              pos.split(',').forEach(p => { const [k2,v] = p.split(':'); styles[k2] = v })
              bords.split(',').forEach(b => { styles[b] = `2px solid ${T.cyan}` })
              return <div key={k} style={{ position: 'absolute', width: 18, height: 18, ...styles }} />
            })}
          </div>
        )}

        {/* Top controls */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'max(14px,env(safe-area-inset-top,14px))' }}>
          <button onClick={onBack} style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: `1px solid ${T.b2}`, borderRadius: 12, color: T.t1, cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.body }}>
            <svg width={7} height={12} viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>

          {/* Card counter */}
          <div style={{ background: done ? `${T.green}18` : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: `1px solid ${done ? T.green + '55' : T.b2}`, borderRadius: 20, padding: '6px 16px', boxShadow: done ? `0 0 18px ${T.green}44` : 'none', transition: 'all 0.3s' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: done ? T.green : T.t1, fontFamily: T.display }}>
              {G.yourCards.length} / 13{done ? ' ✓' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Your hand fan strip */}
      <div style={{ background: T.s1, borderBottom: `1px solid ${T.b1}`, padding: '11px 14px', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.t4, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          YOUR HAND — Hand {G.handNum}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', minHeight: 60, alignItems: 'flex-start' }}>
          {G.yourCards.map((c, i) => (
            <div key={cid(c)} style={{ position: 'relative', animation: `cardDeal 0.28s cubic-bezier(0.22,1,0.36,1) both` }}>
              <PlayingCard card={c} size="sm" dealDelay={-1} />
              <button onClick={() => { upd({ yourCards: G.yourCards.filter(x => cid(x) !== cid(c)) }); haptic([6]) }}
                style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: T.red, border: `2px solid ${T.bg}`, cursor: 'pointer', fontSize: 9, color: '#fff', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
          ))}
          {!done && (
            <button onClick={() => setPicker(true)} style={{ width: 42, height: 60, borderRadius: 7, background: T.cyanDim, border: `1.5px dashed ${T.cyan}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: T.cyan, fontSize: 22 }}>
              +
            </button>
          )}
        </div>
      </div>

      {/* Suit grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 120px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.t4, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          TAP TO SELECT · TAP AGAIN TO REMOVE
        </div>
        {SUITS.map(s => (
          <div key={s} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
              <SuitIcon suit={s} size={12} />
              <span style={{ fontSize: 10, fontWeight: 700, color: IS_RED.has(s) ? T.cardRed : 'rgba(255,255,255,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {s === 'S' ? 'Spades' : s === 'H' ? 'Hearts' : s === 'D' ? 'Diamonds' : 'Clubs'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {RANKS.map(r => {
                const card = { r, s }
                const id   = cid(card)
                const isSel = cardIds.includes(id)
                return (
                  <PlayingCard key={id} card={card} size="sm" selected={isSel} dealDelay={-1}
                    onClick={() => toggleCard(card)} />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Dock */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: `${T.s1}ee`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${T.b1}`, padding: '12px 14px', paddingBottom: 'max(12px,env(safe-area-inset-bottom,12px))', display: 'flex', gap: 9 }}>
        <Btn variant="secondary" onPress={() => setPicker(true)} style={{ flex: 0.7, fontSize: 14, padding: '12px 10px' }}>+ Add</Btn>
        <Btn color={done ? T.green : undefined} onPress={() => { if (done) { haptic([15]); onNext() } }} disabled={!done} style={{ flex: 2 }}>
          {done ? "I've Got 13 →" : `${13 - G.yourCards.length} more needed`}
        </Btn>
      </div>

      {picker && (
        <DeckPicker
          title="Select Your Cards"
          selected={cardIds}
          blocked={G.seenOpp.flat().map(cid)}
          onToggle={toggleCard}
          onClose={() => setPicker(false)}
        />
      )}
    </div>
  )
}
