"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/admin/FormField";

interface ContactData {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

const emptyContact: ContactData = { email: "", phone: "", location: "", availability: "" };

export default function ContactPage() {
  const [form, setForm] = useState<ContactData>(emptyContact);
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
      });
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
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-accent">Contact</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
        <Input label="Phone" value={form.phone} onChange={update("phone")} required />
        <Input label="Location" value={form.location} onChange={update("location")} required />
        <Input label="Availability" value={form.availability} onChange={update("availability")} placeholder="e.g. Open to opportunities" required />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {message && <span className="text-sm text-t-green">{message}</span>}
        </div>
      </form>
    </div>
  );
}
