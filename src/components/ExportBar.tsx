import { exportMarkers } from '../utils/exportMarkers'
import type { ExportFormat, MarkerSet } from '../types'

interface ExportBarProps {
  selected: Set<string>
  sets: MarkerSet[]
  format: ExportFormat
  setFormat: (value: ExportFormat) => void
  onClear: () => void
}

export default function ExportBar({ selected, sets, format, setFormat, onClear }: ExportBarProps) {
  if (selected.size === 0) return null

  async function handleExport() {
    const markers = sets
      .flatMap(s => s.markers)
      .filter(w => selected.has(w.id))

    await exportMarkers(markers, 'markers', format)
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
        {selected.size} marker{selected.size !== 1 ? 's' : ''} selected
      </span>
      <select
        aria-label="Export format"
        value={format}
        onChange={e => setFormat(e.target.value as ExportFormat)}
        className="rounded-lg border border-blue-300 bg-white/95 text-blue-700 text-sm px-2 py-2 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <option value="gpx">GPX</option>
        <option value="kml">KML</option>
      </select>
      <button
        onClick={handleExport}
        className="bg-white text-blue-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex-shrink-0"
      >
        Export {format.toUpperCase()}
      </button>
    </div>
  )
}
