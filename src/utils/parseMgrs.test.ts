import { describe, it, expect } from 'vitest'
import { parseLines } from './parseMgrs'

describe('parseLines', () => {
  it('returns [] for empty input', () => {
    expect(parseLines('')).toEqual([])
  })

  it('returns [] for whitespace-only input', () => {
    expect(parseLines('   \n  \n')).toEqual([])
  })

  it('parses a valid MGRS coordinate', () => {
    const result = parseLines('33UXP0000000000')
    expect(result).toHaveLength(1)
    expect(result[0].valid).toBe(true)
    if (result[0].valid) {
      expect(result[0].mgrs).toBe('33UXP0000000000')
      expect(typeof result[0].lat).toBe('number')
      expect(typeof result[0].lon).toBe('number')
    }
  })

  it('normalizes input by removing spaces and uppercasing', () => {
    const result = parseLines('33U XP 00000 00000')
    expect(result).toHaveLength(1)
    expect(result[0].valid).toBe(true)
    if (result[0].valid) {
      expect(result[0].mgrs).toBe('33UXP0000000000')
      expect(result[0].raw).toBe('33U XP 00000 00000')
    }
  })

  it('preserves the original raw input', () => {
    const raw = '  33U XP 00000 00000  '
    const result = parseLines(raw)
    if (result[0].valid) {
      expect(result[0].raw).toBe(raw.trim())
    }
  })

  it('marks invalid MGRS as invalid with an error message', () => {
    const result = parseLines('NOTMGRS')
    expect(result).toHaveLength(1)
    expect(result[0].valid).toBe(false)
    if (!result[0].valid) {
      expect(typeof result[0].error).toBe('string')
      expect(result[0].error.length).toBeGreaterThan(0)
    }
  })

  it('handles mixed valid and invalid lines', () => {
    const result = parseLines('33UXP0000000000\nNOTMGRS')
    expect(result).toHaveLength(2)
    expect(result[0].valid).toBe(true)
    expect(result[1].valid).toBe(false)
  })

  it('skips blank lines between valid entries', () => {
    const result = parseLines('33UXP0000000000\n\n33UXP0000000000')
    expect(result).toHaveLength(2)
  })
})
