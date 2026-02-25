"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { generateSlug } from "@/utils/slug";
import { parseTags } from "@/utils/tags";
import type { NewsItem } from "@/types/admin";

const empty: NewsItem = {
  _id: "",
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

export default function NewsPage() {
  const [tagsInput, setTagsInput] = useState("");

  const {
    items, loading, editing, setEditing, deleting, setDeleting,
    showForm, handleSave, handleDelete, update, cancelEdit,
  } = useAdminCRUD<NewsItem>({
    resource: "news",
    empty,
    onBeforeSave: (item) => ({ ...item, tags: parseTags(tagsInput) }),
  });

  const startEdit = (item: NewsItem) => {
    setEditing({ ...item });
    setTagsInput((item.tags ?? []).join(", "));
  };

  const startNew = () => {
    setEditing({ ...empty });
    setTagsInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-accent">News</h2>
          <span className="text-fg-dim/40 text-xs font-mono">~/news</span>
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
            { key: "tags", label: "Tags", render: (a) => (
              <div className="flex flex-wrap gap-1">
                {(a.tags ?? []).map((t: string) => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">{t}</span>
                ))}
              </div>
            )},
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
        title="Delete News Article"
        message={`Are you sure you want to delete "${deleting?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
