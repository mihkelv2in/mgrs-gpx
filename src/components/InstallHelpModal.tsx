interface InstallHelpModalProps {
  onClose: () => void
}

const IOS_STEPS = [
  'Open this page in Safari',
  'Tap the Share button (the box with an arrow pointing up) at the bottom of the screen',
  'Scroll down and tap "Add to Home Screen"',
  'Give it a name and tap "Add"',
]

const ANDROID_STEPS = [
  'Open this page in Chrome',
  'Tap the three-dot menu in the top-right corner',
  'Tap "Add to Home screen"',
  'Tap "Add" to confirm',
]

export default function InstallHelpModal({ onClose }: InstallHelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-sm p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Add to Home Screen</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Install this app on your phone for quick access without opening a browser.
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-2">iPhone / iPad</p>
          <ol className="space-y-1.5">
            {IOS_STEPS.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-2">Android</p>
          <ol className="space-y-1.5">
            {ANDROID_STEPS.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
