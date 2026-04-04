import { useState } from 'react'
import { loadSets, saveSets } from '../utils/storage'
import type { MarkerSet } from '../types'

interface UseSetsReturn {
  sets: MarkerSet[]
  addSet: (set: MarkerSet) => void
  deleteSet: (id: string) => void
  deleteMarker: (setId: string, markerId: string) => void
}

export function useSets(): UseSetsReturn {
  const [sets, setSets] = useState<MarkerSet[]>(() => loadSets())

  function persist(next: MarkerSet[]) {
    setSets(next)
    saveSets(next)
  }

  function addSet(set: MarkerSet) {
    persist([set, ...sets])
  }

  function deleteSet(id: string) {
    persist(sets.filter(s => s.id !== id))
  }

  function deleteMarker(setId: string, markerId: string) {
    persist(sets.map(s => {
      if (s.id !== setId) return s
      const markers = s.markers
        .filter(w => w.id !== markerId)
        .map((w, i) => ({ ...w, label: `${s.prefix}${String(i + 1).padStart(3, '0')}` }))
      return { ...s, markers }
    }))
  }

  return { sets, addSet, deleteSet, deleteMarker }
}
