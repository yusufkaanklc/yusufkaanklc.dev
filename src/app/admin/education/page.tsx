"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import type { EduItem, CertItem } from "@/types/admin";

const emptyEdu: EduItem = { _id: "", degree: "", school: "", period: "", description: "" };
const emptyCert: CertItem = { _id: "", name: "", issuer: "" };

export default function EducationPage() {
  const [eduItems, setEduItems] = useState<EduItem[]>([]);
  const [certItems, setCertItems] = useState<CertItem[]>([]);
  const [loadingEdu, setLoadingEdu] = useState(true);
  const [loadingCert, setLoadingCert] = useState(true);
  const [editingEdu, setEditingEdu] = useState<EduItem | null>(null);
  const [editingCert, setEditingCert] = useState<CertItem | null>(null);
  const [deletingEdu, setDeletingEdu] = useState<EduItem | null>(null);
  const [deletingCert, setDeletingCert] = useState<CertItem | null>(null);
  const [showEduForm, setShowEduForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);

  const loadEdu = () =>
    fetch("/api/admin/education")
      .then((r) => r.json())
      .then(setEduItems)
      .finally(() => setLoadingEdu(false));
  const loadCert = () =>
    fetch("/api/admin/certificates")
      .then((r) => r.json())
      .then(setCertItems)
      .finally(() => setLoadingCert(false));
  useEffect(() => { loadEdu(); loadCert(); }, []);

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    const method = editingEdu._id ? "PUT" : "POST";
    const url = editingEdu._id ? `/api/admin/education/${editingEdu._id}` : "/api/admin/education";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingEdu) });
    setEditingEdu(null);
    setShowEduForm(false);
    loadEdu();
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    const method = editingCert._id ? "PUT" : "POST";
    const url = editingCert._id ? `/api/admin/certificates/${editingCert._id}` : "/api/admin/certificates";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCert) });
    setEditingCert(null);
    setShowCertForm(false);
    loadCert();
  };

  const handleDeleteEdu = async () => {
    if (!deletingEdu?._id) return;
    await fetch(`/api/admin/education/${deletingEdu._id}`, { method: "DELETE" });
    setDeletingEdu(null);
    loadEdu();
  };

  const handleDeleteCert = async () => {
    if (!deletingCert?._id) return;
    await fetch(`/api/admin/certificates/${deletingCert._id}`, { method: "DELETE" });
    setDeletingCert(null);
    loadCert();
  };

  const updateEdu = (field: keyof EduItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditingEdu((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  const updateCert = (field: keyof CertItem) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditingCert((prev) => prev ? { ...prev, [field]: e.target.value } : prev);

  return (
    <div className="space-y-8">
      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-accent">Education</h2>
            <span className="text-fg-dim/40 text-xs font-mono">~/education</span>
          </div>
          <button
            onClick={() => { setEditingEdu({ ...emptyEdu }); setShowEduForm(true); }}
            className="px-3 py-2 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium"
          >
            + New
          </button>
        </div>

        {showEduForm && editingEdu && (
          <form onSubmit={handleSaveEdu} className="admin-section space-y-5 admin-fade-in">
            <Input label="Degree" value={editingEdu.degree} onChange={updateEdu("degree")} required />
            <Input label="School" value={editingEdu.school} onChange={updateEdu("school")} required />
            <Input label="Period" value={editingEdu.period} onChange={updateEdu("period")} placeholder="e.g. 2020 - 2024" required />
            <TextArea label="Description" value={editingEdu.description ?? ""} onChange={updateEdu("description")} />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-5 py-2.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium">
                {editingEdu._id ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowEduForm(false); setEditingEdu(null); }} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loadingEdu ? <LoadingSkeleton rows={3} /> : (
          <DataTable
            columns={[
              { key: "degree", label: "Degree" },
              { key: "school", label: "School" },
              { key: "period", label: "Period", render: (e) => <span className="text-fg-dim font-mono text-xs">{e.period}</span> },
            ]}
            data={eduItems}
            onEdit={(item) => { setEditingEdu({ ...item }); setShowEduForm(true); }}
            onDelete={setDeletingEdu}
          />
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-fg-dim/8" />

      {/* Certificates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-accent-secondary">Certificates</h2>
            <span className="text-fg-dim/40 text-xs font-mono">~/certificates</span>
          </div>
          <button
            onClick={() => { setEditingCert({ ...emptyCert }); setShowCertForm(true); }}
            className="px-3 py-2 text-sm rounded-lg bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 hover:bg-accent-secondary/20 transition-all font-medium"
          >
            + New
          </button>
        </div>

        {showCertForm && editingCert && (
          <form onSubmit={handleSaveCert} className="admin-section space-y-5 admin-fade-in">
            <Input label="Name" value={editingCert.name} onChange={updateCert("name")} required />
            <Input label="Issuer" value={editingCert.issuer} onChange={updateCert("issuer")} required />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-5 py-2.5 text-sm rounded-lg bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 hover:bg-accent-secondary/20 transition-all font-medium">
                {editingCert._id ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowCertForm(false); setEditingCert(null); }} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loadingCert ? <LoadingSkeleton rows={3} /> : (
          <DataTable
            columns={[
              { key: "name", label: "Certificate" },
              { key: "issuer", label: "Issuer" },
            ]}
            data={certItems}
            onEdit={(item) => { setEditingCert({ ...item }); setShowCertForm(true); }}
            onDelete={setDeletingCert}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deletingEdu}
        title="Delete Education"
        message={`Are you sure you want to delete "${deletingEdu?.degree}"?`}
        onConfirm={handleDeleteEdu}
        onCancel={() => setDeletingEdu(null)}
      />

      <ConfirmDialog
        open={!!deletingCert}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${deletingCert?.name}"?`}
        onConfirm={handleDeleteCert}
        onCancel={() => setDeletingCert(null)}
      />
    </div>
  );
}
