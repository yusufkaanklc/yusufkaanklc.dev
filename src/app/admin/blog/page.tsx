"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";

interface BlogItem {
  _id?: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime?: number;
  published: boolean;
  url?: string;
}

const emptyPost: BlogItem = {
  title: "",
  slug: "",
  date: "",
  summary: "",
  content: "",
  tags: [],
  coverImage: "",
  published: false,
  url: "",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPage() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogItem | null>(null);
  const [deleting, setDeleting] = useState<BlogItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const load = () =>
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/blog/${editing._id}` : "/api/admin/blog";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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

  const startEdit = (item: BlogItem) => {
    setEditing({ ...item });
    setTagsInput((item.tags ?? []).join(", "));
    setShowForm(true);
  };

  const startNew = () => {
    setEditing({ ...emptyPost });
    setTagsInput("");
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">Blog Posts</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/blog</span>
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
          <Input
            label="Slug"
            value={editing.slug}
            onChange={update("slug")}
            required
          />
          <Input label="Date" type="date" value={editing.date} onChange={update("date")} required />
          <TextArea label="Summary" value={editing.summary} onChange={update("summary")} required />
          <TextArea label="Content (Markdown)" value={editing.content ?? ""} onChange={update("content")} />
          <Input label="Tags (comma-separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          <Input label="Cover Image URL" value={editing.coverImage ?? ""} onChange={update("coverImage")} />
          <Input label="URL (external)" value={editing.url ?? ""} onChange={update("url")} />

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
            {editing.readingTime && (
              <span className="text-xs text-fg-dim">~{editing.readingTime} min read</span>
            )}
          </div>

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
            { key: "tags", label: "Tags", render: (p) => (
              <div className="flex flex-wrap gap-1">
                {(p.tags ?? []).map((t: string) => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">{t}</span>
                ))}
              </div>
            )},
            { key: "published", label: "Status", render: (p) => (
              <span className={`text-xs font-medium ${p.published ? "text-t-green" : "text-fg-dim"}`}>
                {p.published ? "Published" : "Draft"}
              </span>
            )},
            { key: "summary", label: "Summary", render: (p) => <span className="line-clamp-1 text-fg-dim">{p.summary}</span> },
          ]}
          data={items}
          onEdit={startEdit}
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
