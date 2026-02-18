"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-bg border border-fg-dim/20 rounded-lg p-6 max-w-sm w-full mx-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-accent font-bold">{title}</h3>
        <p className="text-fg-muted text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded bg-fg-dim/10 text-fg-muted hover:bg-fg-dim/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-t-red/15 text-t-red hover:bg-t-red/25 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
