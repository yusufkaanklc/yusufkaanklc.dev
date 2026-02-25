"use client";

import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/admin/FormField";
import { TagInput } from "@/components/admin/TagInput";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import type { SkillItem } from "@/types/admin";

const empty: SkillItem = { _id: "", name: "", skills: [] };

export default function SkillsPage() {
  const {
    items, loading, editing, setEditing, deleting, setDeleting,
    showForm, handleSave, handleDelete, startEdit, startNew, cancelEdit,
  } = useAdminCRUD<SkillItem>({ resource: "skills", empty });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Skill Categories</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/skills</span>
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
          <Input label="Category Name" value={editing.name} onChange={(e) => setEditing((p) => p ? { ...p, name: e.target.value } : p)} required />
          <TagInput label="Skills" value={editing.skills} onChange={(skills) => setEditing((p) => p ? { ...p, skills } : p)} />
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
            { key: "name", label: "Category" },
            { key: "skills", label: "Skills", render: (s) => (
              <div className="flex flex-wrap gap-1">
                {s.skills.slice(0, 5).map((sk) => (
                  <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/8 text-accent/70 border border-accent/10">{sk}</span>
                ))}
                {s.skills.length > 5 && <span className="text-[10px] text-fg-dim">+{s.skills.length - 5}</span>}
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
        title="Delete Skill Category"
        message={`Are you sure you want to delete "${deleting?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
