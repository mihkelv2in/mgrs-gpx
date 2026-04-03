import { useState } from 'react'
import { loadSets, saveSets } from '../utils/storage'
import type { WaypointSet } from '../types'

interface UseSetsReturn {
  sets: WaypointSet[]
  addSet: (set: WaypointSet) => void
  deleteSet: (id: string) => void
  deleteWaypoint: (setId: string, waypointId: string) => void
}

export function useSets(): UseSetsReturn {
  const [sets, setSets] = useState<WaypointSet[]>(() => loadSets())

  function persist(next: WaypointSet[]) {
    setSets(next)
    saveSets(next)
  }

  function addSet(set: WaypointSet) {
    persist([set, ...sets])
  }

  function deleteSet(id: string) {
    persist(sets.filter(s => s.id !== id))
  }

  function deleteWaypoint(setId: string, waypointId: string) {
    persist(sets.map(s => {
      if (s.id !== setId) return s
      const waypoints = s.waypoints
        .filter(w => w.id !== waypointId)
        .map((w, i) => ({ ...w, label: `${s.prefix}${String(i + 1).padStart(3, '0')}` }))
      return { ...s, waypoints }
    }))
  }

  return { sets, addSet, deleteSet, deleteWaypoint }
}
