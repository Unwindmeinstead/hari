import { useState, useCallback } from 'react'
import { solveMC, computePlayPosition } from './engine/solver.js'
import { cid } from './engine/cards.js'

import { Splash }            from './screens/Splash.jsx'
import { SetupPlayers, SetupSeats, SetupDealer, SetupScores } from './screens/Setup.jsx'
import { ScanCards }         from './screens/ScanCards.jsx'
import { UpLock }            from './screens/UpLock.jsx'
import { SeenCards }         from './screens/SeenCards.jsx'
import { Solving }           from './screens/Solving.jsx'
import { Recommendation }    from './screens/Recommendation.jsx'
import { MatchWinner }       from './screens/MatchWinner.jsx'

// ── Initial game state ────────────────────────────────────
const initG = () => ({
  playerCount: 4,
  yourSeat:    0,
  dealerSeat:  0,
  players: [
    { name: 'You',    score: 0 },
    { name: 'Left',   score: 0 },
    { name: 'Across', score: 0 },
    { name: 'Right',  score: 0 },
  ],
  targetScore:  1000,
  handNum:      1,
  yourCards:    [],
  seenOpp:      [[], [], []],
  solverResult: null,
})

// ── Screens ───────────────────────────────────────────────
const SCREENS = [
  'splash',
  'setup-players', 'setup-seats', 'setup-dealer', 'setup-scores',
  'scan', 'uplock', 'seen-cards', 'solving', 'recommend',
  'match-winner',
]

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [G, setG]           = useState(initG())

  const upd = useCallback(patch =>
    setG(g => ({ ...g, ...(typeof patch === 'function' ? patch(g) : patch) }))
  , [])

  const goTo = useCallback(s => setScreen(s), [])

  // ── Run Monte Carlo solver ────────────────────────────────
  const runSolver = useCallback((gameState) => {
    const state = gameState || G
    goTo('solving')
    // Small timeout so Solving screen mounts and animates
    setTimeout(() => {
      const pos = computePlayPosition(state.yourSeat, state.dealerSeat, state.playerCount)
      const result = solveMC({
        hand:         state.yourCards,
        seenOpp:      state.seenOpp,
        playerCount:  state.playerCount,
        yourPosition: pos,
        iters:        2400,
      })
      upd({ solverResult: result })
      // Wait for solving animation to finish gracefully
      setTimeout(() => goTo('recommend'), 800)
    }, 80)
  }, [G, goTo, upd])

  // ── Next hand ─────────────────────────────────────────────
  const nextHand = useCallback(() => {
    const newDealer = (G.dealerSeat + 1) % G.playerCount
    upd({
      handNum:      G.handNum + 1,
      dealerSeat:   newDealer,
      yourCards:    [],
      seenOpp:      G.players.slice(1).map(() => []),
      solverResult: null,
    })
    goTo('scan')
  }, [G, upd, goTo])

  // ── Check for match winner ────────────────────────────────
  const checkWinner = useCallback((players) => {
    return players.some(p => p.score >= G.targetScore)
  }, [G.targetScore])

  // ── Render ────────────────────────────────────────────────
  switch (screen) {

    case 'splash':
      return <Splash
        onNewMatch={() => goTo('setup-players')}
        onQuickHand={() => { upd(initG()); goTo('scan') }}
      />

    case 'setup-players':
      return <SetupPlayers G={G} upd={upd}
        onNext={() => goTo('setup-seats')}
        onBack={() => goTo('splash')}
      />

    case 'setup-seats':
      return <SetupSeats G={G} upd={upd}
        onNext={() => goTo('setup-dealer')}
        onBack={() => goTo('setup-players')}
      />

    case 'setup-dealer':
      return <SetupDealer G={G} upd={upd}
        onNext={() => goTo('setup-scores')}
        onBack={() => goTo('setup-seats')}
      />

    case 'setup-scores':
      return <SetupScores G={G} upd={upd}
        onNext={() => goTo('scan')}
        onBack={() => goTo('setup-dealer')}
      />

    case 'scan':
      return <ScanCards G={G} upd={upd}
        onNext={() => goTo('uplock')}
        onBack={() => goTo(G.handNum === 1 ? 'setup-scores' : 'recommend')}
      />

    case 'uplock':
      return <UpLock G={G}
        onConfirm={() => goTo('seen-cards')}
        onBack={() => goTo('scan')}
      />

    case 'seen-cards':
      return <SeenCards G={G} upd={upd}
        onAnalyse={() => runSolver(G)}
        onBack={() => goTo('uplock')}
      />

    case 'solving':
      return <Solving />

    case 'recommend':
      return <Recommendation G={G}
        onNextHand={nextHand}
        onUpdateScores={() => goTo('setup-scores')}
        onNewMatch={() => { setG(initG()); goTo('splash') }}
        onBack={() => goTo('seen-cards')}
      />

    case 'match-winner':
      return <MatchWinner G={G}
        onNewMatch={() => { setG(initG()); goTo('splash') }}
      />

    default:
      return <Splash
        onNewMatch={() => goTo('setup-players')}
        onQuickHand={() => { upd(initG()); goTo('scan') }}
      />
  }
}
