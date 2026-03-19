import { T } from '../styles/tokens.js'
import { IS_RED } from '../engine/cards.js'

const PATHS = {
  S: "M8 1.5C8 1.5 1.5 7 1.5 10.8C1.5 13 3.3 14.8 5.5 14.8C6.5 14.8 7.4 14.4 8.1 13.8C7.8 14.8 7.3 15.8 6 17H10C8.7 15.8 8.2 14.8 7.9 13.8C8.6 14.4 9.5 14.8 10.5 14.8C12.7 14.8 14.5 13 14.5 10.8C14.5 7 8 1.5 8 1.5Z",
  H: "M8 15C8 15 1.5 10 1.5 6C1.5 3.5 3.5 1.5 6 1.5C7.1 1.5 8.1 1.9 8.8 2.6C9.5 1.9 10.5 1.5 11.6 1.5C14.1 1.5 16 3.5 16 6C16 10 8 15 8 15Z",
  D: "M8 1L15 8.5L8 16L1 8.5Z",
  C: "M8 2.5C6.1 2.5 4.5 4.1 4.5 6C4.5 6.8 4.8 7.5 5.2 8.1C4.1 8.5 3.5 9.5 3.5 10.5C3.5 12.4 5.1 14 7 14C7.3 14 7.6 13.9 7.9 13.8L7 16.5H9L8.1 13.8C8.4 13.9 8.7 14 9 14C10.9 14 12.5 12.4 12.5 10.5C12.5 9.5 11.9 8.5 10.8 8.1C11.2 7.5 11.5 6.8 11.5 6C11.5 4.1 9.9 2.5 8 2.5Z",
}

export function SuitIcon({ suit, size = 16, color, style = {} }) {
  const c = color || (IS_RED.has(suit) ? T.cardRed : 'rgba(255,255,255,0.8)')
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 16 18"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path d={PATHS[suit]} fill={c} />
    </svg>
  )
}

export function SuitSymbol({ suit, size = 20, color }) {
  const syms = { S:'♠', H:'♥', D:'♦', C:'♣' }
  const c = color || (IS_RED.has(suit) ? T.cardRed : T.t1)
  return (
    <span style={{
      fontSize: size, color: c, lineHeight: 1,
      fontFamily: 'Georgia, serif', display: 'inline-block',
    }}>
      {syms[suit]}
    </span>
  )
}
