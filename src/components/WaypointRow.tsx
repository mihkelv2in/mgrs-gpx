import { formatMgrs } from '../utils/formatters'
import type { Waypoint } from '../types'

interface WaypointRowProps {
  waypoint: Waypoint
  checked: boolean
  onToggle: () => void
  onDelete: () => void
}

export default function WaypointRow({ waypoint, checked, onToggle, onDelete }: WaypointRowProps) {
  return (
    <div className="flex items-center gap-3 pl-10 pr-4 py-3 border-t border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 min-h-[44px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-4 h-4 accent-blue-500 flex-shrink-0 cursor-pointer"
      />
      <span className="text-sm font-mono font-medium w-20 flex-shrink-0 text-zinc-900 dark:text-zinc-100">
        {waypoint.label}
      </span>
      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex-1 truncate">
        {formatMgrs(waypoint.mgrs)}
      </span>
      <button
        onClick={onDelete}
        aria-label="Delete waypoint"
        className="w-8 h-8 flex items-center justify-center rounded text-zinc-400 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  )
}
