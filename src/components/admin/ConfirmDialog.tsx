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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="admin-section max-w-sm w-full mx-4 space-y-4 admin-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-accent font-bold text-sm">{title}</h3>
        <p className="text-fg-muted text-sm">{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-t-red/10 text-t-red hover:bg-t-red/20 transition-colors border border-t-red/15"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
