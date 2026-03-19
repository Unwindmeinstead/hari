import { useEffect, useState } from 'react'
import { T } from '../styles/tokens.js'
import { Btn, haptic } from '../components/ui.jsx'

function Confetti() {
  const pieces = Array.from({ length: 48 }, (_, i) => {
    const colors = [T.cyan, T.green, T.gold, T.purple, T.red, '#fff']
    return {
      id: i,
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      rot: Math.random() * 720 - 360,
    }
  })

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          top: -20,
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : 2,
          opacity: 0,
          '--cr': `${p.rot}deg`,
          animation: `confetti ${p.duration}s ease-in ${p.delay}s both`,
          boxShadow: `0 0 6px ${p.color}88`,
        }} />
      ))}
    </div>
  )
}

export function MatchWinner({ G, onNewMatch }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    haptic([30, 15, 30, 15, 60])
    setTimeout(() => setShow(true), 100)
  }, [])

  // Find winner — highest score above target
  const sorted = [...G.players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const isYou  = winner.name === G.players[G.yourSeat]?.name

  return (
    <div style={{
      minHeight: '100dvh', background: T.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px',
      position: 'relative', overflow: 'hidden',
    }}>
      <Confetti />

      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${T.gold}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {show && (
        <>
          {/* Trophy */}
          <div style={{ fontSize: 72, marginBottom: 20, animation: 'chipBounce 0.6s ease', position: 'relative', zIndex: 1 }}>
            {isYou ? '🏆' : '🎯'}
          </div>

          {/* HAZARI! */}
          <div style={{ fontFamily: T.display, fontSize: 48, fontWeight: 900, color: T.gold, letterSpacing: '0.04em', lineHeight: 1, textAlign: 'center', textShadow: `0 0 40px ${T.gold}88`, animation: 'scaleIn 0.4s ease', position: 'relative', zIndex: 1 }}>
            HAZARI!
          </div>

          <div style={{ fontSize: 14, color: T.t2, marginTop: 8, marginBottom: 28, animation: 'slideUp 0.4s ease 0.1s both', position: 'relative', zIndex: 1 }}>
            {isYou ? 'You reached 1000!' : `${winner.name} wins!`}
          </div>

          {/* Final scores */}
          <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36, position: 'relative', zIndex: 1 }}>
            {sorted.map((p, i) => {
              const medals = ['🥇', '🥈', '🥉', '4️⃣']
              const isWinner = i === 0
              return (
                <div key={p.name} style={{
                  background: isWinner ? T.goldDim : T.s2,
                  borderRadius: T.r3,
                  border: `1px solid ${isWinner ? T.gold + '44' : T.b1}`,
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  animation: `slideUp 0.35s ease ${i * 0.07 + 0.15}s both`,
                  boxShadow: isWinner ? `0 0 24px ${T.gold}18` : 'none',
                }}>
                  <span style={{ fontSize: 20 }}>{medals[i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.t1 }}>{p.name}</div>
                  </div>
                  <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 900, color: isWinner ? T.gold : T.t2 }}>
                    {p.score}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1, animation: 'slideUp 0.4s ease 0.4s both' }}>
            <Btn color={T.gold} onPress={onNewMatch} icon="🃏">NEW MATCH</Btn>
          </div>
        </>
      )}
    </div>
  )
}
