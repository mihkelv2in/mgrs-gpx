import { useState, useRef, useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import MarkerRow from './MarkerRow'
import ConfirmModal from './ConfirmModal'
import type { MarkerSet } from '../types'

type TriState = 'none' | 'all' | 'some'

interface SetItemProps {
  set: MarkerSet
  selected: Set<string>
  setSelected: Dispatch<SetStateAction<Set<string>>>
  onDeleteSet: (id: string) => void
  onDeleteMarker: (setId: string, markerId: string) => void
}

export default function SetItem({ set, selected, setSelected, onDeleteSet, onDeleteMarker }: SetItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDeleteSet, setConfirmDeleteSet] = useState(false)
  const [confirmDeleteMarker, setConfirmDeleteMarker] = useState<string | null>(null)
  const cbRef = useRef<HTMLInputElement>(null)

  const ids = set.markers.map(w => w.id)
  const selCount = ids.filter(id => selected.has(id)).length
  const triState: TriState = selCount === 0 ? 'none' : selCount === ids.length ? 'all' : 'some'

  useEffect(() => {
    if (cbRef.current) cbRef.current.indeterminate = triState === 'some'
  }, [triState])

  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev)
      if (triState === 'none') ids.forEach(id => next.add(id))
      else ids.forEach(id => next.delete(id))
      return next
    })
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const dateStr = new Date(set.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  })

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700">
      <div className={`flex items-center gap-3 px-4 py-3 min-h-[56px] ${expanded ? 'bg-zinc-50 dark:bg-zinc-800' : ''}`}>
        <input
          ref={cbRef}
          type="checkbox"
          checked={triState === 'all'}
          onChange={toggleAll}
          className="w-4 h-4 accent-blue-500 flex-shrink-0 cursor-pointer"
        />
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {set.name}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {set.markers.length} marker{set.markers.length !== 1 ? 's' : ''} · {dateStr}
          </div>
        </div>
        <button
          onClick={() => setConfirmDeleteSet(true)}
          aria-label="Delete set"
          className="w-10 h-10 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          ✕
        </button>
        <button
          onClick={() => setExpanded(e => !e)}
          aria-label="Expand set"
          className="w-10 h-10 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && set.markers.map(w => (
        <MarkerRow
          key={w.id}
          marker={w}
          checked={selected.has(w.id)}
          onToggle={() => toggleOne(w.id)}
          onDelete={() => setConfirmDeleteMarker(w.id)}
        />
      ))}

      {expanded && set.markers.length === 0 && (
        <div className="pl-10 pr-4 py-3 text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-700">
          No markers remaining
        </div>
      )}

      {confirmDeleteSet && (
        <ConfirmModal
          message={`Delete "${set.name}"? This cannot be undone.`}
          onConfirm={() => { setConfirmDeleteSet(false); onDeleteSet(set.id) }}
          onCancel={() => setConfirmDeleteSet(false)}
        />
      )}

      {confirmDeleteMarker && (
        <ConfirmModal
          message="Delete this marker? This cannot be undone."
          onConfirm={() => { onDeleteMarker(set.id, confirmDeleteMarker); setConfirmDeleteMarker(null) }}
          onCancel={() => setConfirmDeleteMarker(null)}
        />
      )}
    </div>
  )
}
