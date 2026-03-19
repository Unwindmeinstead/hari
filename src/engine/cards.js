export const RANKS = ['A','K','Q','J','10','9','8','7','6','5','4','3','2']
export const SUITS = ['S','H','D','C']
export const SUIT_SYM = { S:'♠', H:'♥', D:'♦', C:'♣' }
export const SUIT_NAME = { S:'Spades', H:'Hearts', D:'Diamonds', C:'Clubs' }
export const IS_RED = new Set(['H','D'])

export const RNK = { A:14,K:13,Q:12,J:11,'10':10,'9':9,'8':8,'7':7,'6':6,'5':5,'4':4,'3':3,'2':2 }
export const PTS = { A:10,K:10,Q:10,J:10,'10':10,'9':5,'8':5,'7':5,'6':5,'5':5,'4':5,'3':5,'2':5 }

export const DECK = SUITS.flatMap(s => RANKS.map(r => ({ r, s })))

export const cid  = c => `${c.r}${c.s}`
export const cpts = c => PTS[c.r]
export const rv   = c => RNK[c.r]

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = 0 | Math.random() * (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const totalPts = cards => cards.reduce((s, c) => s + cpts(c), 0)
