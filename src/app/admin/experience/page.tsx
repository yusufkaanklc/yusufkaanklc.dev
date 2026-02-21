"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import type { ExperienceItem } from "@/types/admin";

const emptyExp: ExperienceItem = { role: "", company: "", location: "", period: "", description: "" };

export default function ExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [deleting, setDeleting] = useState<ExperienceItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/experience")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/experience/${editing._id}` : "/api/admin/experience";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleting?._id) return;
    await fetch(`/api/admin/experience/${deleting._id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const update = (field: keyof ExperienceItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Experience</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/experience</span>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyExp }); setShowForm(true); }}
          className="px-3 py-2 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium"
        >
          + New
        </button>
      </div>

      {showForm && editing && (
        <form onSubmit={handleSave} className="admin-section space-y-5 admin-fade-in">
          <Input label="Role" value={editing.role} onChange={update("role")} required />
          <Input label="Company" value={editing.company} onChange={update("company")} required />
          <Input label="Location" value={editing.location} onChange={update("location")} required />
          <Input label="Period" value={editing.period} onChange={update("period")} placeholder="e.g. Jan 2024 - Present" required />
          <TextArea label="Description" value={editing.description} onChange={update("description")} required />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-5 py-2.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium">
              {editing._id ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? <LoadingSkeleton rows={4} /> : (
        <DataTable
          columns={[
            { key: "role", label: "Role" },
            { key: "company", label: "Company" },
            { key: "period", label: "Period", render: (e) => <span className="text-fg-dim font-mono text-xs">{e.period}</span> },
          ]}
          data={items}
          onEdit={(item) => { setEditing({ ...item }); setShowForm(true); }}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Experience"
        message={`Are you sure you want to delete "${deleting?.role} at ${deleting?.company}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
