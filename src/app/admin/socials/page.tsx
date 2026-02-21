"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import type { SocialItem } from "@/types/admin";

const emptySocial: SocialItem = { name: "", url: "", icon: "" };

export default function SocialsPage() {
  const [items, setItems] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SocialItem | null>(null);
  const [deleting, setDeleting] = useState<SocialItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/socials")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
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
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Social Links</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/socials</span>
        </div>
        <button
          onClick={() => { setEditing({ ...emptySocial }); setShowForm(true); }}
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
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
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
          onEdit={(item) => { setEditing({ ...item }); setShowForm(true); }}
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
