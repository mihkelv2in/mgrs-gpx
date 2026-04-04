import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatMgrs, buildLabel, defaultSetName } from './formatters'

describe('formatMgrs', () => {
  it('formats a 10-digit MGRS string with spaces', () => {
    expect(formatMgrs('33UXP0000000000')).toBe('33U XP 00000 00000')
  })

  it('formats an 8-digit MGRS string', () => {
    expect(formatMgrs('33UXP00000000')).toBe('33U XP 0000 0000')
  })

  it('formats a 6-digit MGRS string', () => {
    expect(formatMgrs('33UXP000000')).toBe('33U XP 000 000')
  })

  it('formats a 4-digit MGRS string', () => {
    expect(formatMgrs('33UXP0000')).toBe('33U XP 00 00')
  })

  it('formats a 2-digit MGRS string', () => {
    expect(formatMgrs('33UXP00')).toBe('33U XP 0 0')
  })

  it('formats a grid-square-only MGRS string', () => {
    expect(formatMgrs('33UXP')).toBe('33U XP')
  })

  it('returns the input unchanged when it does not match MGRS pattern', () => {
    expect(formatMgrs('NOT_MGRS')).toBe('NOT_MGRS')
  })
})

describe('buildLabel', () => {
  it('pads index with leading zeros', () => {
    expect(buildLabel('TGT', 1)).toBe('TGT001')
  })

  it('uppercases the prefix', () => {
    expect(buildLabel('tgt', 1)).toBe('TGT001')
  })

  it('truncates prefix to 5 characters', () => {
    expect(buildLabel('TOOLONG', 1)).toBe('TOOLO001')
  })

  it('handles index >= 1000 without truncation', () => {
    expect(buildLabel('TGT', 1000)).toBe('TGT1000')
  })
})

describe('defaultSetName', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15T09:05:00'))
  })

  it('returns a string starting with "Import"', () => {
    expect(defaultSetName()).toMatch(/^Import /)
  })

  it('includes the formatted date and time', () => {
    expect(defaultSetName()).toBe('Import 15 Jun 09:05')
  })
})
