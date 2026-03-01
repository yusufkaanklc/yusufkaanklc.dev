"use client";

import { useState, useRef, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import { generateSlug } from "@/utils/slug";
import { parseTags } from "@/utils/tags";
import type { BlogItem } from "@/types/admin";

const empty: BlogItem = {
  _id: "",
  title: "",
  slug: "",
  date: "",
  summary: "",
  content: "",
  tags: [],
  coverImage: "",
  readingTime: 0,
  published: false,
  url: "",
};

export default function BlogPage() {
  const [tagsInput, setTagsInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const {
    items, loading, editing, setEditing, deleting, setDeleting,
    showForm, setShowForm, handleSave, handleDelete, update, cancelEdit,
  } = useAdminCRUD<BlogItem>({
    resource: "blog",
    empty,
    onBeforeSave: (item) => ({ ...item, tags: parseTags(tagsInput) }),
  });

  const scrollToForm = () => {
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const startEdit = (item: BlogItem) => {
    setEditing({ ...item });
    setTagsInput((item.tags ?? []).join(", "));
    setShowForm(true);
    scrollToForm();
  };

  const startNew = () => {
    setEditing({ ...empty, date: new Date().toISOString().slice(0, 10) });
    setTagsInput("");
    setShowForm(true);
    scrollToForm();
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
        <form ref={formRef} onSubmit={handleSave} className="admin-section space-y-5 admin-fade-in">
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
          <ImageUpload
            value={editing.coverImage ?? ""}
            onChange={(url) => setEditing((prev) => prev ? { ...prev, coverImage: url } : prev)}
            category="blog"
          />
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
            {editing.readingTime ? (
              <span className="text-xs text-fg-dim">~{editing.readingTime} min read</span>
            ) : null}
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
