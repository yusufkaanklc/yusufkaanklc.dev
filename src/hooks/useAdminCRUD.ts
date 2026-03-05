import { useEffect, useState, useCallback, useRef } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

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
    setError(null);
    const payload = onBeforeSave ? onBeforeSave(editing) : editing;
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/admin/${resource}/${editing._id}` : `/api/admin/${resource}`;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const msg = data?.error
        ? typeof data.error === "string" ? data.error : JSON.stringify(data.error)
        : `Save failed (${res.status})`;
      setError(msg);
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
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
    const today = new Date().toISOString().slice(0, 10);
    setEditing({ ...empty, ...(("date" in empty) ? { date: today } : {}) });
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
    setShowForm,
    error,
    errorRef,
    handleSave,
    handleDelete,
    update,
    startEdit,
    startNew,
    cancelEdit,
  };
}
