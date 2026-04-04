import type { MarkerSet } from '../types'

const KEY = 'mgrs-gpx-sets'

export function loadSets(): MarkerSet[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = JSON.parse(raw) as any[]
    return parsed.map(s => ({
      ...s,
      markers: s.markers ?? s.waypoints ?? [],
    }))
  } catch {
    return []
  }
}

export function saveSets(sets: MarkerSet[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sets))
  } catch (e) {
    console.error('Failed to save sets:', e)
  }
}
