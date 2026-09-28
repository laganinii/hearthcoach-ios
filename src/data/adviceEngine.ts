/**
 * Deterministic demo coach — v1 vertical slice.
 * Real perception / Monte Carlo comes later; tonight proves screenshot → advice UX.
 */

export type BoardPhase = 'early' | 'mid' | 'late' | 'unknown'

export interface AdviceResult {
  headline: string
  action: string
  why: string[]
  risk: 'low' | 'medium' | 'high'
  phase: BoardPhase
  latencyMs: number
  source: 'heuristic-demo'
}

const HEADLINES = [
  'Level if you can hit a clean pair',
  'Hold tempo — freeze is fine this turn',
  'Sell the dead minion, buy the tribe enabler',
  'Play for top-4: stabilize before climbing',
  'Hero power now; shop is trash',
]

export function adviseFromScreenshotMeta(meta: {
  fileName?: string | null
  width?: number | null
  height?: number | null
}): AdviceResult {
  const t0 = Date.now()
  const name = (meta.fileName || '').toLowerCase()
  let phase: BoardPhase = 'unknown'
  if (name.includes('early') || name.includes('turn1') || name.includes('turn2')) phase = 'early'
  else if (name.includes('late') || name.includes('turn10')) phase = 'late'
  else if (name.includes('mid')) phase = 'mid'
  else {
    const area = (meta.width || 0) * (meta.height || 0)
    phase = area > 2_000_000 ? 'mid' : area > 0 ? 'early' : 'unknown'
  }

  const idx = Math.abs(hash(name || String(meta.width || 7))) % HEADLINES.length
  const headline = HEADLINES[idx]

  const why =
    phase === 'early'
      ? ['Economy > board this early', 'Avoid overcommitting to a dead tribe', 'Keep 1 gold for discovery if available']
      : phase === 'late'
        ? ['Lethal math matters more than shiny buys', 'Check opponent scam pieces', 'Defense into top-4 if HP is low']
        : ['Board strength looks middling — tempo trade', 'Prefer sticky / deathrattle over vanilla', 'Note tavern tier before rolling deep']

  const action =
    phase === 'early'
      ? 'Buy the cheapest tribe enabler; do not level unless you are already strong.'
      : phase === 'late'
        ? 'Fill board, then freeze only if the shop solves a clear hole.'
        : 'One purposeful roll, then commit. Do not greed a second roll.'

  const risk: AdviceResult['risk'] = phase === 'late' ? 'high' : phase === 'early' ? 'low' : 'medium'

  return {
    headline,
    action,
    why,
    risk,
    phase,
    latencyMs: Math.max(12, Date.now() - t0 + 88),
    source: 'heuristic-demo',
  }
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}
