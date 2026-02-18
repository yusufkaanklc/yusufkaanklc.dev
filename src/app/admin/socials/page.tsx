"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/admin/FormField";

interface SocialItem {
  _id?: string;
  name: string;
  url: string;
  icon: string;
}

const emptySocial: SocialItem = { name: "", url: "", icon: "" };

export default function SocialsPage() {
  const [items, setItems] = useState<SocialItem[]>([]);
  const [editing, setEditing] = useState<SocialItem | null>(null);
  const [deleting, setDeleting] = useState<SocialItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/admin/socials").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/socials/${editing._id}` : "/api/admin/socials";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleting?._id) return;
    await fetch(`/api/admin/socials/${deleting._id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const update = (field: keyof SocialItem) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditing((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Social Links</h2>
        <button
          onClick={() => { setEditing({ ...emptySocial }); setShowForm(true); }}
          className="px-3 py-1.5 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
        >
          + New Social
        </button>
      </div>

      {showForm && editing && (
        <form onSubmit={handleSave} className="space-y-4 p-4 rounded-lg border border-fg-dim/15 bg-bg">
          <Input label="Name" value={editing.name} onChange={update("name")} placeholder="e.g. GitHub" required />
          <Input label="URL" value={editing.url} onChange={update("url")} placeholder="https://..." required />
          <Input label="Icon" value={editing.icon} onChange={update("icon")} placeholder="Optional icon identifier" />
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
          { key: "url", label: "URL", render: (s) => <span className="text-accent text-xs">{s.url}</span> },
        ]}
        data={items}
        onEdit={(item) => { setEditing({ ...item }); setShowForm(true); }}
        onDelete={setDeleting}
      />

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
