"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { TagInput } from "@/components/admin/TagInput";

interface ProjectItem {
  _id?: string;
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

const emptyProject: ProjectItem = { name: "", description: "", tech: [], url: "", github: "" };

export default function ProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState<ProjectItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/admin/projects").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/projects/${editing._id}` : "/api/admin/projects";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleting?._id) return;
    await fetch(`/api/admin/projects/${deleting._id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const update = (field: keyof ProjectItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Projects</h2>
        <button
          onClick={() => { setEditing({ ...emptyProject }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
        >
          + New Project
        </button>
      </div>

      {showForm && editing && (
        <form onSubmit={handleSave} className="space-y-4 p-4 rounded-lg border border-fg-dim/15 bg-bg">
          <Input label="Name" value={editing.name} onChange={update("name")} required />
          <TextArea label="Description" value={editing.description} onChange={update("description")} required />
          <TagInput label="Technologies" value={editing.tech} onChange={(tech) => setEditing((p) => p ? { ...p, tech } : p)} />
          <Input label="URL" value={editing.url ?? ""} onChange={update("url")} />
          <Input label="GitHub" value={editing.github ?? ""} onChange={update("github")} />
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
          { key: "name", label: "Name" },
          { key: "description", label: "Description", render: (p) => <span className="line-clamp-1">{p.description}</span> },
          { key: "tech", label: "Tech", render: (p) => p.tech.join(", ") },
        ]}
        data={items}
        onEdit={(item) => { setEditing({ ...item }); setShowForm(true); }}
        onDelete={setDeleting}
      />

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
