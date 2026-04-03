interface TopBarProps {
  dark: boolean
  onToggle: () => void
}

export default function TopBar({ dark, onToggle }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <span className="font-medium text-base text-zinc-900 dark:text-zinc-100">
        MGRS → GPX
      </span>
      <button
        onClick={onToggle}
        aria-label="Toggle dark mode"
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {dark ? '☀' : '☾'}
      </button>
    </div>
  )
}
