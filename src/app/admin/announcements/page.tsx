"use client";

import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { generateSlug } from "@/utils/slug";
import { priorityColors } from "@/utils/priority";
import type { AnnouncementItem } from "@/types/admin";

const empty: AnnouncementItem = {
  _id: "",
  title: "",
  slug: "",
  date: "",
  summary: "",
  content: "",
  priority: "normal",
  published: false,
};

export default function AnnouncementsPage() {
  const {
    items, loading, editing, setEditing, deleting, setDeleting,
    showForm, handleSave, handleDelete, update, startNew, cancelEdit, startEdit,
  } = useAdminCRUD<AnnouncementItem>({ resource: "announcements", empty });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Announcements</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/announcements</span>
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
          <Input label="Title" value={editing.title} onChange={(e) => {
            const title = e.target.value;
            setEditing((prev) => prev ? {
              ...prev,
              title,
              ...(prev._id ? {} : { slug: generateSlug(title) }),
            } : prev);
          }} required />
          <Input label="Slug" value={editing.slug} onChange={update("slug")} required />
          <Input label="Date" type="date" value={editing.date} onChange={update("date")} required />
          <TextArea label="Summary" value={editing.summary} onChange={update("summary")} required />
          <TextArea label="Content (Markdown)" value={editing.content ?? ""} onChange={update("content")} />

          <div>
            <label className="block text-xs text-fg-dim mb-2 font-mono uppercase tracking-wider">Priority</label>
            <div className="flex gap-2">
              {(["normal", "important", "critical"] as const).map((p) => {
                const colors = priorityColors[p];
                const isActive = editing.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditing((prev) => prev ? { ...prev, priority: p } : prev)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all font-medium capitalize ${
                      isActive
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : "bg-fg-dim/5 text-fg-dim border-fg-dim/10 hover:bg-fg-dim/10"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-fg-muted cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing((prev) => prev ? { ...prev, published: e.target.checked } : prev)}
                className="accent-accent w-4 h-4"
              />
              Published
            </label>
          </div>

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

      {loading ? <LoadingSkeleton rows={5} /> : (
        <DataTable
          columns={[
            { key: "title", label: "Title" },
            { key: "date", label: "Date", render: (a) => <span className="text-fg-dim font-mono text-xs">{a.date}</span> },
            { key: "priority", label: "Priority", render: (a) => {
              const colors = priorityColors[a.priority as keyof typeof priorityColors] ?? priorityColors.normal;
              return (
                <span className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} font-medium capitalize`}>
                  {a.priority}
                </span>
              );
            }},
            { key: "published", label: "Status", render: (a) => (
              <span className={`text-xs font-medium ${a.published ? "text-t-green" : "text-fg-dim"}`}>
                {a.published ? "Published" : "Draft"}
              </span>
            )},
            { key: "summary", label: "Summary", render: (a) => <span className="line-clamp-1 text-fg-dim">{a.summary}</span> },
          ]}
          data={items}
          onEdit={startEdit}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleting?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
