import { useEffect, useState, useCallback } from "react";

interface WithId {
  _id: string;
}

interface UseAdminCRUDOptions<T extends WithId> {
  resource: string;
  empty: T;
  onBeforeSave?: (item: T) => T | Record<string, unknown>;
}

export function useAdminCRUD<T extends WithId>({ resource, empty, onBeforeSave }: UseAdminCRUDOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/${resource}`)
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, [resource]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = onBeforeSave ? onBeforeSave(editing) : editing;
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/${resource}/${editing._id}` : `/api/admin/${resource}`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setEditing(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleting?._id) return;
    await fetch(`/api/admin/${resource}/${deleting._id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const update = (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  const startEdit = (item: T) => {
    setEditing({ ...item });
    setShowForm(true);
  };

  const startNew = () => {
    setEditing({ ...empty });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditing(null);
  };

  return {
    items,
    loading,
    editing,
    setEditing,
    deleting,
    setDeleting,
    showForm,
    handleSave,
    handleDelete,
    update,
    startEdit,
    startNew,
    cancelEdit,
  };
}
