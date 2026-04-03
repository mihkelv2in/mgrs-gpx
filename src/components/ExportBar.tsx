import { buildGpx } from '../utils/buildGpx'
import type { WaypointSet } from '../types'

interface ExportBarProps {
  selected: Set<string>
  sets: WaypointSet[]
  onClear: () => void
}

export default function ExportBar({ selected, sets, onClear }: ExportBarProps) {
  if (selected.size === 0) return null

  async function handleExport() {
    const waypoints = sets
      .flatMap(s => s.waypoints)
      .filter(w => selected.has(w.id))

    const gpxStr = buildGpx(waypoints, 'waypoints')
    const file = new File([gpxStr], 'waypoints.gpx', { type: 'application/gpx+xml' })

    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'waypoints.gpx' })
        return
      }
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') console.error(e)
      else return
    }

    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = 'waypoints.gpx'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="bg-blue-600 flex items-center gap-3 px-4 py-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={onClear}
        className="text-xs text-blue-200 hover:text-white flex-shrink-0"
      >
        ✕ clear
      </button>
      <span className="text-sm text-white flex-1">
        {selected.size} waypoint{selected.size !== 1 ? 's' : ''} selected
      </span>
      <button
        onClick={handleExport}
        className="bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex-shrink-0"
      >
        Export GPX
      </button>
    </div>
  )
}
