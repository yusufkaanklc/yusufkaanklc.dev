"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/admin/FormField";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import type { ContactData } from "@/types/admin";

const emptyContact: ContactData = { email: "", phone: "", location: "", availability: "" };

export default function ContactPage() {
  const [form, setForm] = useState<ContactData>(emptyContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            email: data.email ?? "",
            phone: data.phone ?? "",
            location: data.location ?? "",
            availability: data.availability ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMessage("Contact updated successfully.");
      else setMessage("Failed to update contact.");
    } catch {
      setMessage("Error updating contact.");
    }
    setSaving(false);
  };

  const update = (field: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-accent">Contact</h2>
        <span className="text-fg-dim/40 text-xs font-mono">~/contact</span>
      </div>

      {loading ? (
        <FormSkeleton fields={4} />
      ) : (
        <div className="admin-section">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
            <Input label="Phone" value={form.phone} onChange={update("phone")} required />
            <Input label="Location" value={form.location} onChange={update("location")} required />
            <Input label="Availability" value={form.availability} onChange={update("availability")} placeholder="e.g. Open to opportunities" required />

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all disabled:opacity-50 font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {message && <span className="text-sm text-t-green font-mono text-xs">{message}</span>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
