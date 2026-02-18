"use client";

import { useEffect, useState, useRef } from "react";
import { Input, TextArea } from "@/components/admin/FormField";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      })
      .finally(() => setLoading(false));
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, resumeUrl: data.url }));
        setMessage("Resume uploaded. Don't forget to save.");
      } else {
        setMessage(data.error || "Upload failed.");
      }
    } catch {
      setMessage("Upload failed.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const update = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-accent">Profile</h2>
        <span className="text-fg-dim/40 text-xs font-mono">~/profile</span>
      </div>

      {loading ? (
        <FormSkeleton fields={9} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="admin-section space-y-5">
            <h3 className="text-sm font-medium text-fg-dim uppercase tracking-wider border-b border-fg-dim/8 pb-2">Personal</h3>
            <Input label="Name" value={form.name} onChange={update("name")} required />
            <Input label="Username" value={form.username} onChange={update("username")} required />
            <Input label="Title" value={form.title} onChange={update("title")} placeholder="e.g. Full Stack Developer" required />
            <TextArea label="Bio" value={form.bio} onChange={update("bio")} required />
            <Input label="Location" value={form.location} onChange={update("location")} required />
          </div>

          {/* Contact Info */}
          <div className="admin-section space-y-5">
            <h3 className="text-sm font-medium text-fg-dim uppercase tracking-wider border-b border-fg-dim/8 pb-2">Contact</h3>
            <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
            <Input label="Phone" value={form.phone} onChange={update("phone")} required />
            <Input label="Website" value={form.website} onChange={update("website")} required />
          </div>

          {/* Resume */}
          <div className="admin-section space-y-4">
            <h3 className="text-sm font-medium text-fg-dim uppercase tracking-wider border-b border-fg-dim/8 pb-2">Resume</h3>

            {form.resumeUrl && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary/80 border border-fg-dim/8">
                <span className="text-accent font-mono text-xs">PDF</span>
                <span className="text-fg-muted text-sm flex-1 truncate">{form.resumeUrl}</span>
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:text-accent/80 transition-colors px-2 py-1 rounded border border-accent/15 hover:bg-accent/10"
                >
                  View
                </a>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs text-fg-dim font-medium uppercase tracking-wider">Upload Resume (PDF)</label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2.5 text-sm rounded-lg bg-bg-secondary/80 border border-fg-dim/12 text-fg-muted hover:border-accent/40 hover:text-fg transition-all disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Choose File"}
                </button>
                <span className="text-xs text-fg-dim">Max 10MB, PDF only</span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all disabled:opacity-50 font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {message && (
              <span className={`text-xs font-mono ${message.includes("fail") || message.includes("Error") ? "text-t-red" : "text-t-green"}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
