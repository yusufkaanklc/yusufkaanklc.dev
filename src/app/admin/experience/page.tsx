"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";

interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

const emptyExp: ExperienceItem = { role: "", company: "", location: "", period: "", description: "" };

export default function ExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [deleting, setDeleting] = useState<ExperienceItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/admin/experience").then((r) => r.json()).then(setItems);
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
        <h2 className="text-xl font-bold text-accent">Experience</h2>
        <button
          onClick={() => { setEditing({ ...emptyExp }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
        >
          + New Experience
        </button>
      </div>

      {showForm && editing && (
        <form onSubmit={handleSave} className="space-y-4 p-4 rounded-lg border border-fg-dim/15 bg-bg">
          <Input label="Role" value={editing.role} onChange={update("role")} required />
          <Input label="Company" value={editing.company} onChange={update("company")} required />
          <Input label="Location" value={editing.location} onChange={update("location")} required />
          <Input label="Period" value={editing.period} onChange={update("period")} placeholder="e.g. Jan 2024 - Present" required />
          <TextArea label="Description" value={editing.description} onChange={update("description")} required />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors">
              {editing._id ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 text-sm rounded bg-fg-dim/10 text-fg-muted hover:bg-fg-dim/20 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <DataTable
        columns={[
          { key: "role", label: "Role" },
          { key: "company", label: "Company" },
          { key: "period", label: "Period" },
        ]}
        data={items}
        onEdit={(item) => { setEditing({ ...item }); setShowForm(true); }}
        onDelete={setDeleting}
      />

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
