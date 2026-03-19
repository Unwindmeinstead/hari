import { useEffect, useState } from 'react'
import { T } from '../styles/tokens.js'

const COMBO_CYCLE = ['Indi','Indi','Pair','Indi','Colour','Pair','Run','Indi','Pair','Colour Run','Troy','Indi','Pair','Run','Colour','Pair','Indi','Colour Run']

export function Solving() {
  const [progress, setProgress] = useState(0)
  const [comboIdx, setComboIdx] = useState(0)
  const [candidates, setCandidates] = useState(0)
  const [evEst, setEvEst] = useState(0)

  useEffect(() => {
    // Smooth fake progress — real solver fires in App.jsx via setTimeout
    const start = Date.now()
    const duration = 1600

    const frame = () => {
      const elapsed = Date.now() - start
      const raw = elapsed / duration
      // ease-out curve — fast start, slow finish
      const eased = 1 - Math.pow(1 - Math.min(raw, 0.92), 2.2)
      setProgress(eased)
      setCandidates(Math.floor(eased * 847))
      setEvEst(Math.floor(eased * 58))
      if (elapsed < duration * 0.95) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    const comboTimer = setInterval(() => {
      setComboIdx(i => (i + 1) % COMBO_CYCLE.length)
    }, 110)

    return () => clearInterval(comboTimer)
  }, [])

  const pct      = Math.round(progress * 100)
  const combo    = COMBO_CYCLE[comboIdx]
  const comboCol = T.combo[combo] || T.t3

  return (
    <div style={{
      minHeight: '100dvh', background: T.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 0, padding: '40px 28px',
      position: 'relative', overflow: 'hidden',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Ambient */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${T.cyan}06 0%, transparent 65%)`, pointerEvents: 'none' }} />

      {/* Spinner rings */}
      <div style={{ position: 'relative', width: 88, height: 88, marginBottom: 32 }}>
        {/* Outer ring */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${T.b2}` }} />
        {/* Spinning arc */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid transparent`, borderTopColor: T.cyan, animation: 'spin 0.8s linear infinite', boxShadow: `0 0 18px ${T.cyan}44` }} />
        {/* Counter-spin inner */}
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: `1.5px solid transparent`, borderTopColor: T.purple, animation: 'spinReverse 1.2s linear infinite' }} />
        {/* Center icon */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, animation: 'glowPulse 1.5s ease infinite' }}>
          🧠
        </div>
      </div>

      {/* Title */}
      <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 900, color: T.t1, letterSpacing: '-0.02em', marginBottom: 4 }}>
        Monte Carlo
      </div>
      <div style={{ fontSize: 13, color: T.t3, marginBottom: 32 }}>
        Simulating opponent hand distributions…
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 280, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: T.t3, fontWeight: 600 }}>Progress</span>
          <span style={{ fontSize: 11, color: T.cyan, fontWeight: 700, fontFamily: T.display }}>{pct}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 99, background: T.s4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${T.cyan}88, ${T.cyan})`, borderRadius: 99, boxShadow: `0 0 10px ${T.cyan}66`, transition: 'width 0.1s linear' }} />
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 280, marginTop: 16, marginBottom: 24 }}>
        {[
          { label: 'Candidates', value: candidates.toLocaleString(), color: T.t1 },
          { label: 'Avg EV so far', value: `+${evEst} pts`, color: T.gold },
          { label: 'Opp model', value: 'Greedy split', color: T.green },
          { label: 'Tie rule', value: 'Last plays wins', color: T.purple },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: T.s2, borderRadius: T.r2, border: `1px solid ${T.b1}`, padding: '10px 12px' }}>
            <div style={{ fontSize: 9, color: T.t4, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: T.display }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Cycling combo ticker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: comboCol, boxShadow: `0 0 8px ${comboCol}`, animation: 'glowPulse 0.4s ease infinite' }} />
        <span style={{ fontSize: 12, color: comboCol, fontWeight: 700, fontFamily: T.display, letterSpacing: '0.04em', minWidth: 100, animation: 'countUp 0.12s ease' }}>
          {combo.toUpperCase()}
        </span>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: comboCol, boxShadow: `0 0 8px ${comboCol}`, animation: 'glowPulse 0.4s ease 0.2s infinite' }} />
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: T.t4, textAlign: 'center' }}>
        Evaluating valid splits with optimal opponent model
      </div>
    </div>
  )
}
