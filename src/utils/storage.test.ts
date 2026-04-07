import { describe, it, expect, beforeEach } from 'vitest'
import { loadSets, saveSets } from './storage'
import type { MarkerSet } from '../types'

const KEY = 'mgrs-exporter-sets'
const LEGACY_KEY = 'mgrs-gpx-sets'
const MARKER = { id: 'm1', label: 'TGT001', mgrs: '33UXP0000000000', lat: 51.5, lon: 0.1 }

const SET: MarkerSet = {
  id: 's1',
  name: 'Test Set',
  prefix: 'TGT',
  createdAt: '2024-01-01T00:00:00.000Z',
  markers: [MARKER],
}

beforeEach(() => localStorage.clear())

describe('loadSets', () => {
  it('returns [] when storage is empty', () => {
    expect(loadSets()).toEqual([])
  })

  it('returns [] on corrupt JSON', () => {
    localStorage.setItem(KEY, 'not json')
    expect(loadSets()).toEqual([])
  })

  it('round-trips a saved set', () => {
    saveSets([SET])
    expect(loadSets()).toEqual([SET])
  })

  it('migrates legacy waypoints field to markers', () => {
    const legacy = { ...SET, markers: undefined, waypoints: [MARKER] }
    localStorage.setItem(LEGACY_KEY, JSON.stringify([legacy]))
    const result = loadSets()
    expect(result[0].markers).toEqual([MARKER])
  })

  it('does not persist waypoints field after migration', () => {
    const legacy = { ...SET, markers: undefined, waypoints: [MARKER] }
    localStorage.setItem(LEGACY_KEY, JSON.stringify([legacy]))
    const result = loadSets()
    expect(result[0]).not.toHaveProperty('waypoints')
  })

  it('prefers markers over waypoints when both are present', () => {
    const other = { ...MARKER, id: 'm2', label: 'TGT002' }
    const both = { ...SET, waypoints: [other] }
    localStorage.setItem(KEY, JSON.stringify([both]))
    expect(loadSets()[0].markers).toEqual([MARKER])
  })

  it('falls back to [] when both markers and waypoints are absent', () => {
    const empty = { id: 's2', name: 'Empty', prefix: 'X', createdAt: '' }
    localStorage.setItem(KEY, JSON.stringify([empty]))
    expect(loadSets()[0].markers).toEqual([])
  })
})

describe('saveSets', () => {
  it('persists multiple sets', () => {
    const second = { ...SET, id: 's2', name: 'Second' }
    saveSets([SET, second])
    expect(loadSets()).toHaveLength(2)
  })

  it('overwrites previously saved sets', () => {
    saveSets([SET])
    saveSets([])
    expect(loadSets()).toEqual([])
  })
})
