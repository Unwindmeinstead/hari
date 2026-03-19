import { T } from '../styles/tokens.js'

export function FeltTable({
  players      = [],
  playerCount  = 4,
  yourSeat     = 0,
  dealerSeat   = 0,
  onSeatTap,
  showDealer   = false,
  seenCounts   = [],  // number of seen cards per opponent
  compact      = false,
}) {
  const n  = Math.min(playerCount, players.length)
  const W  = compact ? 260 : 300
  const H  = compact ? 200 : 240
  const cx = W / 2
  const cy = H / 2
  const rx = compact ? 88  : 108
  const ry = compact ? 60  : 72
  const pr = compact ? 92  : 118   // player orbit radius X
  const py = compact ? 68  : 86    // player orbit radius Y
  const cr = compact ? 22  : 26    // seat circle radius

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="felt" cx="50%" cy="42%">
            <stop offset="0%"   stopColor="#1E5232" />
            <stop offset="60%"  stopColor="#163A24" />
            <stop offset="100%" stopColor={T.feltLo} />
          </radialGradient>
          <radialGradient id="feltGlow" cx="50%" cy="40%">
            <stop offset="0%"   stopColor="rgba(0,255,136,0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="seatGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="tableShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(0,0,0,0.7)" />
          </filter>
        </defs>

        {/* Table shadow */}
        <ellipse cx={cx} cy={cy + 10} rx={rx + 12} ry={ry + 8}
          fill="rgba(0,0,0,0.45)" />

        {/* Felt surface */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill="url(#felt)"
          filter="url(#tableShadow)" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill="url(#feltGlow)" />

        {/* Inner decorative ring */}
        <ellipse cx={cx} cy={cy} rx={rx - 14} ry={ry - 10}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1} />

        {/* Center watermark */}
        <text x={cx} y={cy + 4} textAnchor="middle"
          fill="rgba(255,255,255,0.04)"
          fontSize={10} fontFamily={T.display}
          fontWeight={900} letterSpacing={4}>
          HAZARI
        </text>

        {/* Seat circles */}
        {players.slice(0, n).map((p, i) => {
          const deg  = 270 + (i * 360 / n)
          const rad  = deg * Math.PI / 180
          const x    = cx + pr * Math.cos(rad)
          const y    = cy + py * Math.sin(rad)
          const isYou   = i === yourSeat
          const isDealer = showDealer && i === dealerSeat
          const seen    = seenCounts[i - 1] || 0  // i=0 is you
          const hasSeen = i !== yourSeat && seen > 0

          return (
            <g key={i}
              onClick={() => onSeatTap && onSeatTap(i)}
              style={{ cursor: onSeatTap ? 'pointer' : 'default' }}>

              {/* Pulse ring for your seat */}
              {isYou && (
                <circle cx={x} cy={y} r={cr + 8}
                  fill="none"
                  stroke={T.cyan}
                  strokeWidth={1}
                  opacity={0.3}
                  style={{ animation: 'pulseRing 2s ease-out infinite' }} />
              )}

              {/* Seat circle */}
              <circle cx={x} cy={y} r={cr}
                fill={isYou ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.04)'}
                stroke={isYou ? T.cyan : 'rgba(255,255,255,0.14)'}
                strokeWidth={isYou ? 2 : 1}
                style={isYou ? { filter: `drop-shadow(0 0 10px ${T.cyan}66)` } : undefined}
              />

              {/* Dealer chip */}
              {isDealer && (
                <>
                  <circle
                    cx={x + cr - 2} cy={y - cr + 2} r={10}
                    fill={T.gold}
                    style={{ animation: 'chipBounce 0.5s ease', filter: `drop-shadow(0 0 6px ${T.gold}88)` }}
                  />
                  <text x={x + cr - 2} y={y - cr + 6}
                    textAnchor="middle" fill="#000"
                    fontSize={8} fontWeight={900}
                    fontFamily={T.display}>D</text>
                </>
              )}

              {/* Seen card badge */}
              {hasSeen && (
                <>
                  <circle cx={x - cr + 2} cy={y - cr + 2} r={9}
                    fill={T.cyan} />
                  <text x={x - cr + 2} y={y - cr + 6}
                    textAnchor="middle" fill="#000"
                    fontSize={8} fontWeight={700}
                    fontFamily={T.body}>{seen}</text>
                </>
              )}

              {/* Player name */}
              <text x={x} y={y - 2}
                textAnchor="middle"
                fill={isYou ? T.cyan : 'rgba(255,255,255,0.72)'}
                fontSize={9} fontWeight={700}
                fontFamily={T.body}>
                {p.name.slice(0, 7)}
              </text>

              {/* Score */}
              <text x={x} y={y + 11}
                textAnchor="middle"
                fill={isYou ? 'rgba(0,229,255,0.7)' : 'rgba(255,255,255,0.32)'}
                fontSize={8} fontFamily={T.body}>
                {p.score}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
