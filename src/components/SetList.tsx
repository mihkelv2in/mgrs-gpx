import type { Dispatch, SetStateAction } from 'react'
import SetItem from './SetItem'
import type { WaypointSet } from '../types'

interface SetListProps {
  sets: WaypointSet[]
  selected: Set<string>
  setSelected: Dispatch<SetStateAction<Set<string>>>
  onDeleteSet: (id: string) => void
  onDeleteWaypoint: (setId: string, waypointId: string) => void
}

export default function SetList({ sets, selected, setSelected, onDeleteSet, onDeleteWaypoint }: SetListProps) {
  if (!sets.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
        <p className="text-sm">No saved sets yet</p>
        <p className="text-xs mt-1">Parse and save coordinates from the Input tab</p>
      </div>
    )
  }

  return (
    <div>
      {sets.map(s => (
        <SetItem
          key={s.id}
          set={s}
          selected={selected}
          setSelected={setSelected}
          onDeleteSet={onDeleteSet}
          onDeleteWaypoint={onDeleteWaypoint}
        />
      ))}
    </div>
  )
}
