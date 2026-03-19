const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL    = 'llama-3.3-70b-versatile'

export async function generateInsight(solverResult, seenOpp = [], playerNames = []) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) return null

  const top = solverResult[0]
  if (!top) return null

  const packetSummary = top.split.map((g, i) => ({
    packet:  i + 1,
    type:    g.type,
    cards:   g.cards.map(c => c.r + c.s).join(' '),
    winPct:  Math.round((top.winRates[i] || 0) * 100),
    ptEV:    Math.round(top.pointEV?.[i] || 0),
  }))

  const seenSummary = seenOpp
    .map((cards, i) => cards.length > 0
      ? `${playerNames[i] || `Opp${i+1}`}: ${cards.map(c => c.r + c.s).join(' ')}`
      : null
    )
    .filter(Boolean)
    .join('; ')

  const prompt = `You are a sharp Hazari card game strategist. 
Hazari is a 4-player South Asian card game where 13 cards are split into 3-3-3-4 packets (strongest to weakest).
Combos: Troy > Colour Run > Run > Colour > Pair > Indi. A-2-3 is second-highest run.
The 4-card packet must be the weakest. Last player to play equal combos wins each round.

Split analysis:
${packetSummary.map(p => `Packet ${p.packet}: ${p.type} [${p.cards}] — wins ${p.winPct}% of round ${p.packet}s, EV +${p.ptEV}pts`).join('\n')}
Total expected: +${Math.round(top.ev)}pts. Overall win rate: ${Math.round(top.avgWinRate * 100)}%.
${seenSummary ? `Seen opponent cards: ${seenSummary}` : 'No opponent cards seen.'}

Write exactly 2 punchy sentences of street-level tactical insight. Be specific about packet numbers and combo types. No bullet points. No markdown. Plain text only.`

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 100,
        temperature: 0.5,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
}
