"use client";

import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import type { SocialItem } from "@/types/admin";

const empty: SocialItem = { _id: "", name: "", url: "", icon: "" };

export default function SocialsPage() {
  const {
    items, loading, editing, deleting, setDeleting,
    showForm, handleSave, handleDelete, update, startEdit, startNew, cancelEdit,
  } = useAdminCRUD<SocialItem>({ resource: "socials", empty });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Social Links</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/socials</span>
        </div>
        <button
          onClick={startNew}
          className="px-3 py-2 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium"
        >
          + New
        </button>
      </div>

      {showForm && editing && (
        <form onSubmit={handleSave} className="admin-section space-y-5 admin-fade-in">
          <Input label="Name" value={editing.name} onChange={update("name")} placeholder="e.g. GitHub" required />
          <Input label="URL" value={editing.url} onChange={update("url")} placeholder="https://..." required />
          <Input label="Icon" value={editing.icon} onChange={update("icon")} placeholder="Optional icon identifier" />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-5 py-2.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium">
              {editing._id ? "Update" : "Create"}
            </button>
            <button type="button" onClick={cancelEdit} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? <LoadingSkeleton rows={4} /> : (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "url", label: "URL", render: (s) => <span className="text-accent/60 text-xs font-mono">{s.url}</span> },
          ]}
          data={items}
          onEdit={startEdit}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Social Link"
        message={`Are you sure you want to delete "${deleting?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
