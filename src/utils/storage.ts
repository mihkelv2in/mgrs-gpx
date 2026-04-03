import type { WaypointSet } from '../types'

const KEY = 'mgrs-gpx-sets'

export function loadSets(): WaypointSet[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as WaypointSet[]) : []
  } catch {
    return []
  }
}

export function saveSets(sets: WaypointSet[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(sets))
  } catch (e) {
    console.error('Failed to save sets:', e)
  }
}
