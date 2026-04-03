interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-sm p-5"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-sm text-zinc-800 dark:text-zinc-100 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
