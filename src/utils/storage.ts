import type { Marker, MarkerSet } from '../types'

type StoredMarkerSet = Omit<MarkerSet, 'markers'> & { markers?: Marker[]; waypoints?: Marker[] }

const KEY = 'mgrs-gpx-sets'

export function loadSets(): MarkerSet[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredMarkerSet[]
    return parsed.map(({ id, name, prefix, createdAt, markers, waypoints }) => ({
      id,
      name,
      prefix,
      createdAt,
      markers: markers ?? waypoints ?? [],
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
