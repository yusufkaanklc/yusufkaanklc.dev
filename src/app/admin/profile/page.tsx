"use client";

import { useEffect, useState } from "react";
import { Input, TextArea } from "@/components/admin/FormField";

interface ProfileData {
  name: string;
  username: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  resumeUrl: string;
}

const emptyProfile: ProfileData = {
  name: "",
  username: "",
  title: "",
  bio: "",
  location: "",
  email: "",
  phone: "",
  website: "",
  resumeUrl: "",
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileData>(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            name: data.name ?? "",
            username: data.username ?? "",
            title: data.title ?? "",
            bio: data.bio ?? "",
            location: data.location ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            website: data.website ?? "",
            resumeUrl: data.resumeUrl ?? "",
          });
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMessage("Profile updated successfully.");
      else setMessage("Failed to update profile.");
    } catch {
      setMessage("Error updating profile.");
    }
    setSaving(false);
  };

  const update = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-bold text-accent">Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={update("name")} required />
        <Input label="Username" value={form.username} onChange={update("username")} required />
        <Input label="Title" value={form.title} onChange={update("title")} required />
        <TextArea label="Bio" value={form.bio} onChange={update("bio")} required />
        <Input label="Location" value={form.location} onChange={update("location")} required />
        <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
        <Input label="Phone" value={form.phone} onChange={update("phone")} required />
        <Input label="Website" value={form.website} onChange={update("website")} required />
        <Input label="Resume URL" value={form.resumeUrl} onChange={update("resumeUrl")} required />

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
