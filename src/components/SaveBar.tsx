import { defaultSetName } from '../utils/formatters'

interface SaveBarProps {
  prefix: string
  setPrefix: (value: string) => void
  setName: string
  onSetName: (value: string) => void
  onSave: () => void
  onExport: () => void
}

export default function SaveBar({ prefix, setPrefix, setName, onSetName, onSave, onExport }: SaveBarProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
      <div className="flex gap-2">
        <input
          value={setName}
          onChange={e => onSetName(e.target.value)}
          placeholder={defaultSetName()}
          className="flex-1 min-w-0 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={prefix}
          onChange={e => setPrefix(e.target.value.toUpperCase().slice(0, 5))}
          placeholder="WPT"
          maxLength={5}
          className="w-20 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 px-2 py-2.5 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onExport}
          className="flex-1 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 text-sm font-medium py-2.5 rounded-lg"
        >
          Export
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  )
}
