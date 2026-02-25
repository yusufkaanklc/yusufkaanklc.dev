"use client";

import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { TagInput } from "@/components/admin/TagInput";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import type { ProjectItem } from "@/types/admin";

const empty: ProjectItem = { _id: "", name: "", description: "", tech: [], url: "", github: "" };

export default function ProjectsPage() {
  const {
    items, loading, editing, setEditing, deleting, setDeleting,
    showForm, handleSave, handleDelete, update, startEdit, startNew, cancelEdit,
  } = useAdminCRUD<ProjectItem>({ resource: "projects", empty });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Projects</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/projects</span>
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
          <Input label="Name" value={editing.name} onChange={update("name")} required />
          <TextArea label="Description" value={editing.description} onChange={update("description")} required />
          <TagInput label="Technologies" value={editing.tech} onChange={(tech) => setEditing((p) => p ? { ...p, tech } : p)} />
          <Input label="URL" value={editing.url ?? ""} onChange={update("url")} />
          <Input label="GitHub" value={editing.github ?? ""} onChange={update("github")} />
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
            { key: "name", label: "Name" },
            { key: "description", label: "Description", render: (p) => <span className="line-clamp-1 text-fg-dim">{p.description}</span> },
            { key: "tech", label: "Tech", render: (p) => (
              <div className="flex flex-wrap gap-1">
                {p.tech.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/8 text-accent/70 border border-accent/10">{t}</span>
                ))}
                {p.tech.length > 3 && <span className="text-[10px] text-fg-dim">+{p.tech.length - 3}</span>}
              </div>
            )},
          ]}
          data={items}
          onEdit={startEdit}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleting?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
