import * as mgrs from 'mgrs'
import type { ParsedEntry } from '../types'

export function parseLines(rawInput: string): ParsedEntry[] {
  return rawInput
    .split('\n')
    .map((line): ParsedEntry | null => {
      const trimmed = line.trim()
      if (!trimmed) return null

      const normalized = trimmed.replace(/\s+/g, '').toUpperCase()

      try {
        const [lon, lat] = mgrs.toPoint(normalized)
        return { raw: trimmed, mgrs: normalized, lat, lon, valid: true }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Invalid MGRS'
        return { raw: trimmed, error: msg, valid: false }
      }
    })
    .filter((x): x is ParsedEntry => x !== null)
}
