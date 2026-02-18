"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";

interface BlogItem {
  _id?: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  url?: string;
}

const emptyPost: BlogItem = { title: "", date: "", summary: "", content: "", url: "" };

export default function BlogPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [deleting, setDeleting] = useState<BlogItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/blog/${editing._id}` : "/api/admin/blog";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleting?._id) return;
    await fetch(`/api/admin/blog/${deleting._id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const update = (field: keyof BlogItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Blog Posts</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/blog</span>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyPost }); setShowForm(true); }}
          className="px-3 py-2 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium"
        >
          + New
        </button>
      </div>

      {showForm && editing && (
        <form onSubmit={handleSave} className="admin-section space-y-5 admin-fade-in">
          <Input label="Title" value={editing.title} onChange={update("title")} required />
          <Input label="Date" type="date" value={editing.date} onChange={update("date")} required />
          <TextArea label="Summary" value={editing.summary} onChange={update("summary")} required />
          <TextArea label="Content" value={editing.content ?? ""} onChange={update("content")} />
          <Input label="URL" value={editing.url ?? ""} onChange={update("url")} />
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

      {loading ? <LoadingSkeleton rows={5} /> : (
        <DataTable
          columns={[
            { key: "title", label: "Title" },
            { key: "date", label: "Date", render: (p) => <span className="text-fg-dim font-mono text-xs">{p.date}</span> },
            { key: "summary", label: "Summary", render: (p) => <span className="line-clamp-1 text-fg-dim">{p.summary}</span> },
          ]}
          data={items}
          onEdit={(item) => { setEditing({ ...item }); setShowForm(true); }}
          onDelete={setDeleting}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleting?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
