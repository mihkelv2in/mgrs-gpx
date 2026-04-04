import type { MarkerSet } from '../types'

const KEY = 'mgrs-gpx-sets'

export function loadSets(): MarkerSet[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as MarkerSet[]) : []
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
