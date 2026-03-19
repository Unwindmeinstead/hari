import { rv, cpts } from './cards.js'

// ── Combo types (correct Hazari names) ──────────────────
export const COMBO_TYPES = ['Troy','Colour Run','Run','Colour','Pair','Indi']
export const COMBO_RANK  = { Troy:6, 'Colour Run':5, Run:4, Colour:3, Pair:2, Indi:1 }

// ── Predicates ──────────────────────────────────────────
export const isTroy   = cs => cs[0].r === cs[1].r && cs[1].r === cs[2].r
export const sameSuit = cs => cs[0].s === cs[1].s && cs[1].s === cs[2].s

export function isSeq(cs) {
  const v = cs.map(rv).sort((a, b) => b - a)
  const normal = v[0] - v[1] === 1 && v[1] - v[2] === 1
  const aceLow = v[0] === 14 && v[1] === 3 && v[2] === 2   // A-2-3 ✓ valid
  // 2-A-K (v=[14,13,2]) is NOT a sequence — ace cannot wrap
  return normal || aceLow
}

export function isPair(cs) {
  return cs[0].r === cs[1].r || cs[1].r === cs[2].r || cs[0].r === cs[2].r
}

// ── Combo strength scalar (sortable integer) ─────────────
export function comboStr(cs) {
  const v = cs.map(rv).sort((a, b) => b - a)

  // Troy: 6000 + rank
  if (isTroy(cs)) return 6000 + v[0]

  const col = sameSuit(cs)
  const seq = isSeq(cs)

  // A-2-3: second highest run/colour run (value 15, beats K-Q-J=13)
  const isAceLow = v[0] === 14 && v[1] === 3 && v[2] === 2
  const seqVal   = isAceLow ? 15 : v[0]

  if (col && seq) return 5000 + seqVal   // Colour Run
  if (seq)        return 4000 + seqVal   // Run

  // Colour: compare h→m→l
  if (col) return 3000 + v[0] * 100 + v[1] * 10 + v[2]

  // Pair: compare pair rank first, then kicker
  if (isPair(cs)) {
    const sorted = cs.map(rv).sort((a, b) => b - a)
    // Find the pair
    let pairRank, kicker
    if (sorted[0] === sorted[1]) { pairRank = sorted[0]; kicker = sorted[2] }
    else                         { pairRank = sorted[1]; kicker = sorted[0] }
    return 2000 + pairRank * 100 + kicker
  }

  // Indi (Individual): compare h→m→l
  return 1000 + v[0] * 100 + v[1] * 10 + v[2]
}

export function comboLabel(cs) {
  if (isTroy(cs))   return 'Troy'
  const col = sameSuit(cs), seq = isSeq(cs)
  if (col && seq)   return 'Colour Run'
  if (seq)          return 'Run'
  if (col)          return 'Colour'
  if (isPair(cs))   return 'Pair'
  return 'Indi'
}

// ── Best 3-of-4 cards ────────────────────────────────────
export function best3of4(cards) {
  let best = null, bStr = -1
  for (let i = 0; i < 4; i++) {
    const trio = cards.filter((_, j) => j !== i)
    const s    = comboStr(trio)
    if (s > bStr) { bStr = s; best = trio }
  }
  return best
}

// ── Build a group descriptor ──────────────────────────────
export function makeGroup(cards, is4card = false) {
  const eff   = is4card ? best3of4(cards) : cards
  const str   = comboStr(eff)
  const type  = comboLabel(eff)
  const pts   = totalPts(cards)
  return { cards, eff, str, type, pts }
}

function totalPts(cards) {
  return cards.reduce((s, c) => s + cpts(c), 0)
}
