import { DECK, cid, cpts, shuffle } from './cards.js'
import { comboStr } from './combos.js'
import { enumerateSplits, greedySplit, isValidSplit } from './validation.js'

// ═══════════════════════════════════════════════════════
// CORE SIMULATION
// ═══════════════════════════════════════════════════════

export function solveMC({
  hand,
  seenOpp    = [],
  playerCount = 4,
  yourPosition = 0,     // 0 = plays first (worst ties), 3 = plays last (best ties)
  iters       = 2400,
}) {
  if (!hand || hand.length !== 13) return []

  // 1. Build unknown card pool
  const knownIds = new Set([
    ...hand.map(cid),
    ...seenOpp.flat().map(cid),
  ])
  const pool = DECK.filter(c => !knownIds.has(cid(c)))
  const nOpp = playerCount - 1

  // 2. Enumerate valid candidate splits for YOUR hand
  const candidates = enumerateSplits(hand, 600)
  if (candidates.length === 0) return []

  const spc = Math.max(6, Math.floor(iters / candidates.length))

  // 3. Simulate each candidate
  const results = candidates.map(mySplit => {
    let totalPts   = 0
    const roundWins = [0, 0, 0, 0]
    const roundPts  = [0, 0, 0, 0]

    for (let sim = 0; sim < spc; sim++) {
      // Sample opponent hands (respecting seen constraints)
      const sh = shuffle(pool)
      let idx = 0
      const oppHands = Array(nOpp).fill(null).map((_, o) => {
        const fixed = seenOpp[o] || []
        const need  = 13 - fixed.length
        const drawn = sh.slice(idx, idx + Math.min(need, sh.length - idx))
        idx += need
        return [...fixed, ...drawn]
      })

      // CRITICAL: opponents split OPTIMALLY (greedy), not randomly
      const oppSplits = oppHands
        .map(h => h.length >= 4 ? greedySplit(h) : null)
        .filter(Boolean)

      // Resolve 4 rounds with correct tie rule
      // Play order matters: yourPosition determines when you play relative to opponents
      // For simplicity: opponents are at positions 0..nOpp-1, you at yourPosition
      for (let round = 0; round < 4; round++) {
        const pkt = mySplit[round]

        // Collect all packets for this round
        // playOrder: list of [strength, position_index, isYou, pts]
        const entries = []

        // Your entry at yourPosition in the play order
        entries.push({ str: pkt.str, pos: yourPosition, isYou: true, pts: pkt.pts })

        // Opponents fill remaining positions
        const oppPositions = Array.from({ length: playerCount }, (_, i) => i).filter(i => i !== yourPosition)
        oppSplits.forEach((os, o) => {
          if (os && os[round]) {
            entries.push({ str: os[round].str, pos: oppPositions[o] || o, isYou: false, pts: os[round].pts })
          }
        })

        // Sort by play position (ascending = play order)
        entries.sort((a, b) => a.pos - b.pos)

        // LAST-PLAYER-WINS TIE RULE:
        // Iterate in play order; higher or equal strength overwrites winner
        let winStr = -1
        let winner = null
        for (const entry of entries) {
          if (entry.str >= winStr) {
            winStr  = entry.str
            winner  = entry
          }
        }

        if (winner?.isYou) {
          // You win this round — collect all cards
          const allPts = entries.reduce((s, e) => s + e.pts, 0)
          roundWins[round]++
          roundPts[round] += allPts
          totalPts += allPts
        }
      }
    }

    const ev          = totalPts / spc
    const winRates    = roundWins.map(w => w / spc)
    const pointEV     = roundPts.map(p => p / spc)
    const avgWinRate  = winRates.reduce((s, w) => s + w, 0) / 4

    return {
      split: mySplit,
      ev,
      winRates,
      pointEV,
      avgWinRate,
      confidence: calcConfidence(spc),
    }
  })

  results.sort((a, b) => b.ev - a.ev)
  return results.slice(0, 3)
}

// ── Confidence rating based on sample count ──────────────
function calcConfidence(spc) {
  if (spc >= 20) return 'high'
  if (spc >= 10) return 'medium'
  return 'low'
}

// ── Compute your play position from seats ─────────────────
// Returns 0 (plays first) to playerCount-1 (plays last)
// First player: right of dealer = (dealerSeat + 1) % n  anticlockwise
// In array terms: you are yourSeat, positions go anticlockwise from dealerSeat+1
export function computePlayPosition(yourSeat, dealerSeat, playerCount) {
  const firstPlayer = (dealerSeat + 1) % playerCount
  let pos = 0
  let seat = firstPlayer
  for (let i = 0; i < playerCount; i++) {
    if (seat === yourSeat) return pos
    pos++
    // anticlockwise: go backwards through seats
    seat = (seat - 1 + playerCount) % playerCount
  }
  return 0
}
