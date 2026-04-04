import { buildLabel, formatMgrs } from '../utils/formatters'
import type { ParsedEntry } from '../types'

interface RowProps {
  item: ParsedEntry
  label: string
  parsedIdx: number
  onLabelChange: (idx: number, value: string) => void
}

function Row({ item, label, parsedIdx, onLabelChange }: RowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-700 min-h-[44px]">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.valid ? 'bg-green-500' : 'bg-red-500'}`} />
      {item.valid ? (
        <>
          <input
            value={label}
            onChange={e => onLabelChange(parsedIdx, e.target.value)}
            className="text-sm font-mono font-medium w-24 flex-shrink-0 bg-transparent border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-zinc-900 dark:text-zinc-100"
          />
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
            {formatMgrs(item.mgrs)}
          </span>
        </>
      ) : (
        <>
          <span className="text-sm font-mono flex-1 text-red-600 dark:text-red-400 truncate">
            {item.raw}
          </span>
          <span className="text-xs text-red-500 dark:text-red-400 flex-shrink-0">
            invalid
          </span>
        </>
      )}
    </div>
  )
}

interface ParsedResultsProps {
  parsed: ParsedEntry[]
  prefix: string
  customLabels: Record<number, string>
  onLabelChange: (idx: number, value: string) => void
}

export default function ParsedResults({ parsed, prefix, customLabels, onLabelChange }: ParsedResultsProps) {
  if (!parsed.length) return null
  let validIdx = 0
  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700">
      {parsed.map((item, i) => {
        const autoLabel = item.valid ? buildLabel(prefix, ++validIdx) : ''
        const label = item.valid ? (customLabels[i] ?? autoLabel) : ''
        return <Row key={i} item={item} label={label} parsedIdx={i} onLabelChange={onLabelChange} />
      })}
    </div>
  )
}
