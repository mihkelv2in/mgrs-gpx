interface InputSectionProps {
  raw: string
  setRaw: (value: string) => void
  onParse: () => void
  onClear: () => void
  validCount: number
  invalidCount: number
  hasParsed: boolean
}

export default function InputSection({ raw, setRaw, onParse, onClear, validCount, invalidCount, hasParsed }: InputSectionProps) {
  return (
    <div className="p-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
        One MGRS coordinate per line
      </p>
      <textarea
        value={raw}
        onChange={e => setRaw(e.target.value)}
        placeholder={'33UXP1234567890\n33UXP9876543210'}
        rows={6}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={onParse}
          disabled={!raw.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-medium py-2.5 rounded-lg"
        >
          Parse
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>
      {hasParsed && (
        <p className="text-xs mt-2">
          <span className="text-green-600 dark:text-green-400">{validCount} valid</span>
          {invalidCount > 0 && (
            <span className="text-red-500 dark:text-red-400 ml-2">{invalidCount} invalid</span>
          )}
        </p>
      )}
    </div>
  )
}
