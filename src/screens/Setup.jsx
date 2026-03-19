import { T } from '../styles/tokens.js'
import { FeltTable } from '../components/FeltTable.jsx'
import { Btn, ScoreRail } from '../components/ui.jsx'

// ── Shared shell ─────────────────────────────────────────
function SetupShell({ step, total, title, subtitle, children, cta, onBack }) {
  return (
    <div style={{
      minHeight: '100dvh', background: T.bg,
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Nav */}
      <div style={{
        background: T.s1, borderBottom: `1px solid ${T.b1}`,
        padding: '0 18px',
        paddingTop: 'env(safe-area-inset-top, 0)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 52 }}>
          {onBack && (
            <button onClick={onBack} style={{
              background: 'none', border: 'none', color: T.cyan,
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: T.body, padding: '0 8px 0 0',
            }}>
              <svg width={7} height={12} viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.t1, letterSpacing: '-0.02em' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 11, color: T.t3, marginTop: 1, fontWeight: 500 }}>
                {subtitle}
              </div>
            )}
          </div>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: total }, (_, i) => (
              <div key={i} style={{
                width: i < step ? 20 : 6, height: 6, borderRadius: 3,
                background: i < step ? T.cyan : i === step ? T.t3 : T.s5,
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {children}
      </div>

      {/* CTA dock */}
      {cta && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: `${T.s1}ee`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${T.b1}`,
          padding: '12px 18px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        }}>{cta}</div>
      )}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.s2, borderRadius: T.r3,
      border: `1px solid ${T.b1}`,
      overflow: 'hidden', ...style,
    }}>{children}</div>
  )
}

function Row({ label, hint, icon, children, last, onPress }) {
  return (
    <div onClick={onPress} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.b1}`,
      cursor: onPress ? 'pointer' : 'default',
    }}>
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: T.r2,
          background: T.s4, border: `1px solid ${T.b2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{icon}</div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: T.t1 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>{hint}</div>}
      </div>
      {children}
      {onPress && (
        <svg width={7} height={12} viewBox="0 0 7 12" fill="none">
          <path d="M1 1L6 6L1 11" stroke={T.t4} strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

// ── SetupPlayers ─────────────────────────────────────────
export function SetupPlayers({ G, upd, onNext, onBack }) {
  return (
    <SetupShell step={1} total={4} title="Players" subtitle="How many at the table?"
      onBack={onBack}
      cta={<Btn onPress={onNext}>Continue →</Btn>}>
      <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[3, 4].map(n => (
          <button key={n} onClick={() => {
            const pls = [{ name: 'You', score: 0 }]
            ;['Left', 'Across', 'Right'].slice(0, n - 1).forEach(nm => pls.push({ name: nm, score: 0 }))
            upd({ playerCount: n, players: pls, seenOpp: Array(n - 1).fill(null).map(() => []) })
          }} style={{
            background: G.playerCount === n ? T.cyanDim : T.s2,
            border: `1px solid ${G.playerCount === n ? T.cyan + '55' : T.b1}`,
            borderRadius: T.r4,
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: G.playerCount === n ? `0 0 28px ${T.cyan}18` : 'none',
            transition: 'all 0.18s',
            textAlign: 'left',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: T.r3,
              background: G.playerCount === n ? T.cyan : T.s4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, flexShrink: 0,
              boxShadow: G.playerCount === n ? `0 0 18px ${T.cyan}55` : 'none',
              color: G.playerCount === n ? '#000' : T.t2,
              fontFamily: T.display, fontWeight: 900,
            }}>{n}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.t1, fontFamily: T.display }}>
                {n} Players
              </div>
              <div style={{ fontSize: 13, color: T.t3, marginTop: 3 }}>
                {n === 4 ? 'Standard Hazari' : '3-player variant'}
              </div>
            </div>
            {G.playerCount === n && (
              <div style={{ marginLeft: 'auto', color: T.cyan, fontSize: 22 }}>✓</div>
            )}
          </button>
        ))}
      </div>
    </SetupShell>
  )
}

// ── SetupSeats ───────────────────────────────────────────
export function SetupSeats({ G, upd, onNext, onBack }) {
  return (
    <SetupShell step={2} total={4} title="Seating" subtitle="Tap a seat to mark yourself"
      onBack={onBack}
      cta={<Btn onPress={onNext}>Continue →</Btn>}>
      <FeltTable
        players={G.players} playerCount={G.playerCount}
        yourSeat={G.yourSeat} dealerSeat={G.dealerSeat}
        onSeatTap={i => upd({ yourSeat: i })}
      />
      <div style={{ padding: '0 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Opponent Names
        </div>
        <Card>
          {G.players.slice(1).map((p, i) => (
            <Row key={i} icon={['←', '↑', '→'][i]}
              label={['Left', 'Across', 'Right'][i]}
              last={i === G.players.length - 2}>
              <input
                value={p.name}
                onChange={e => {
                  const pls = [...G.players]
                  pls[i + 1] = { ...pls[i + 1], name: e.target.value }
                  upd({ players: pls })
                }}
                placeholder={['Left', 'Across', 'Right'][i]}
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 15, color: T.t1, textAlign: 'right',
                  width: 110, fontFamily: T.body, fontWeight: 500,
                }}
              />
            </Row>
          ))}
        </Card>
      </div>
    </SetupShell>
  )
}

// ── SetupDealer ──────────────────────────────────────────
export function SetupDealer({ G, upd, onNext, onBack }) {
  return (
    <SetupShell step={3} total={4} title="Dealer" subtitle="Tap the seat that deals"
      onBack={onBack}
      cta={<Btn onPress={onNext}>Continue →</Btn>}>
      <FeltTable
        players={G.players} playerCount={G.playerCount}
        yourSeat={G.yourSeat} dealerSeat={G.dealerSeat}
        onSeatTap={i => upd({ dealerSeat: i })}
        showDealer
      />
      <div style={{ padding: '0 18px' }}>
        <Card>
          <Row icon="⚡" label="Play is anti-clockwise" last
            hint="Right of dealer plays first · Dealer rotates right each hand" />
        </Card>
      </div>
    </SetupShell>
  )
}

// ── SetupScores ──────────────────────────────────────────
export function SetupScores({ G, upd, onNext, onBack }) {
  return (
    <SetupShell step={4} total={4} title={`Race to ${G.targetScore}`}
      subtitle="Enter scores if resuming a match"
      onBack={onBack}
      cta={<Btn variant="green" onPress={onNext} icon="🎲">START HAND</Btn>}>

      <ScoreRail players={G.players} target={G.targetScore} dealerSeat={G.dealerSeat} />

      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Current Scores
        </div>
        <Card>
          {G.players.map((p, i) => (
            <Row key={i}
              icon={i === G.dealerSeat ? '🟡' : '👤'}
              label={p.name + (i === G.yourSeat ? ' (You)' : '')}
              last={i === G.players.length - 1}>
              <input
                type="number" value={p.score}
                onChange={e => {
                  const pls = [...G.players]
                  pls[i] = { ...pls[i], score: parseInt(e.target.value) || 0 }
                  upd({ players: pls })
                }}
                style={{
                  width: 74, background: T.s4,
                  border: `1px solid ${T.b2}`,
                  borderRadius: T.r2,
                  padding: '7px 10px', textAlign: 'right',
                  fontSize: 16, fontWeight: 700,
                  color: T.t1, outline: 'none',
                  fontFamily: T.body,
                }}
              />
            </Row>
          ))}
        </Card>

        <div style={{ marginTop: 16, fontSize: 10, fontWeight: 700, color: T.t4, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Settings
        </div>
        <Card>
          <Row label="Target score" icon="🏆" last>
            <input
              type="number" value={G.targetScore}
              onChange={e => upd({ targetScore: parseInt(e.target.value) || 1000 })}
              style={{
                width: 74, background: T.s4,
                border: `1px solid ${T.b2}`,
                borderRadius: T.r2,
                padding: '7px 10px', textAlign: 'right',
                fontSize: 16, fontWeight: 700,
                color: T.gold, outline: 'none',
                fontFamily: T.body,
              }}
            />
          </Row>
        </Card>
      </div>
    </SetupShell>
  )
}
