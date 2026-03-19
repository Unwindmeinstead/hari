import { comboStr, best3of4, makeGroup } from './combos.js'
import { shuffle } from './cards.js'

// ── Validate a split ──────────────────────────────────────
// Rule: packets must be ordered strongest→weakest
// 4-card group (index 3) must be ≤ weakest 3-card group (index 2)
export function isValidSplit(split) {
  if (!split || split.length !== 4) return false
  const s = split.map(g => g.str)
  return s[0] >= s[1] && s[1] >= s[2] && s[3] <= s[2]
}

// ── Greedy valid split from a hand ───────────────────────
// Constructs the optimal valid split for a hand
// Used for opponent modeling in the MC simulation
export function greedySplit(hand) {
  if (!hand || hand.length < 13) return null

  const h = [...hand]
  let bestSplit = null
  let bestScore = -1

  // Try multiple random arrangements and pick best valid one
  for (let attempt = 0; attempt < 300; attempt++) {
    const sh = shuffle(h)
    const groups = [
      makeGroup(sh.slice(0, 3)),
      makeGroup(sh.slice(3, 6)),
      makeGroup(sh.slice(6, 9)),
      makeGroup(sh.slice(9, 13), true),
    ]

    // Sort first 3 by strength descending
    const sorted3 = groups.slice(0, 3).sort((a, b) => b.str - a.str)
    const g4      = groups[3]
    const split   = [...sorted3, g4]

    if (isValidSplit(split)) {
      // Score = maximize P1, then P2, then P3
      const score = split[0].str * 1e8 + split[1].str * 1e4 + split[2].str
      if (score > bestScore) {
        bestScore = score
        bestSplit = split
      }
    }
  }

  // Fallback: if no valid split found (rare edge case), force one
  if (!bestSplit) {
    const sh  = shuffle(h)
    const all = [
      makeGroup(sh.slice(0, 3)),
      makeGroup(sh.slice(3, 6)),
      makeGroup(sh.slice(6, 9)),
      makeGroup(sh.slice(9, 13), true),
    ]
    const sorted3 = all.slice(0, 3).sort((a, b) => b.str - a.str)
    const g4 = all[3]
    // Force packet 4 to be weakest by using weakest 3-card group slot
    bestSplit = [sorted3[0], sorted3[1], sorted3[2], g4]
  }

  return bestSplit
}

// ── Enumerate diverse valid splits ────────────────────────
// Returns up to maxSplits unique valid split candidates
export function enumerateSplits(hand, maxSplits = 600) {
  const seen    = new Set()
  const results = []

  const tryAdd = (split) => {
    if (!isValidSplit(split)) return
    const key = split.map(g =>
      g.cards.map(c => c.r + c.s).sort().join(',')
    ).join('|')
    if (seen.has(key)) return
    seen.add(key)
    results.push(split)
  }

  let iters = 0
  while (results.length < maxSplits && iters < maxSplits * 8) {
    iters++
    const sh = shuffle([...hand])
    const groups = [
      makeGroup(sh.slice(0, 3)),
      makeGroup(sh.slice(3, 6)),
      makeGroup(sh.slice(6, 9)),
      makeGroup(sh.slice(9, 13), true),
    ]
    const sorted3 = groups.slice(0, 3).sort((a, b) => b.str - a.str)
    tryAdd([...sorted3, groups[3]])
  }

  return results
}
