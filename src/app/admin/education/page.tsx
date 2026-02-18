"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";

interface EduItem {
  _id?: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
}

interface CertItem {
  _id?: string;
  name: string;
  issuer: string;
}

const emptyEdu: EduItem = { degree: "", school: "", period: "", description: "" };
const emptyCert: CertItem = { name: "", issuer: "" };

export default function EducationPage() {
  const [eduItems, setEduItems] = useState<EduItem[]>([]);
  const [certItems, setCertItems] = useState<CertItem[]>([]);
  const [editingEdu, setEditingEdu] = useState<EduItem | null>(null);
  const [editingCert, setEditingCert] = useState<CertItem | null>(null);
  const [deletingEdu, setDeletingEdu] = useState<EduItem | null>(null);
  const [deletingCert, setDeletingCert] = useState<CertItem | null>(null);
  const [showEduForm, setShowEduForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);

  const loadEdu = () => fetch("/api/admin/education").then((r) => r.json()).then(setEduItems);
  const loadCert = () => fetch("/api/admin/certificates").then((r) => r.json()).then(setCertItems);
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
          <h2 className="text-xl font-bold text-accent">Education</h2>
          <button
            onClick={() => { setEditingEdu({ ...emptyEdu }); setShowEduForm(true); }}
            className="px-3 py-1.5 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors"
          >
            + New Education
          </button>
        </div>

        {showEduForm && editingEdu && (
          <form onSubmit={handleSaveEdu} className="space-y-4 p-4 rounded-lg border border-fg-dim/15 bg-bg">
            <Input label="Degree" value={editingEdu.degree} onChange={updateEdu("degree")} required />
            <Input label="School" value={editingEdu.school} onChange={updateEdu("school")} required />
            <Input label="Period" value={editingEdu.period} onChange={updateEdu("period")} placeholder="e.g. 2020 - 2024" required />
            <TextArea label="Description" value={editingEdu.description ?? ""} onChange={updateEdu("description")} />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm rounded bg-accent/15 text-accent border border-accent/20 hover:bg-accent/25 transition-colors">
                {editingEdu._id ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowEduForm(false); setEditingEdu(null); }} className="px-4 py-2 text-sm rounded bg-fg-dim/10 text-fg-muted hover:bg-fg-dim/20 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        <DataTable
          columns={[
            { key: "degree", label: "Degree" },
            { key: "school", label: "School" },
            { key: "period", label: "Period" },
          ]}
          data={eduItems}
          onEdit={(item) => { setEditingEdu({ ...item }); setShowEduForm(true); }}
          onDelete={setDeletingEdu}
        />
      </div>

      {/* Certificates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-accent-secondary">Certificates</h2>
          <button
            onClick={() => { setEditingCert({ ...emptyCert }); setShowCertForm(true); }}
            className="px-3 py-1.5 text-sm rounded bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/20 hover:bg-accent-secondary/25 transition-colors"
          >
            + New Certificate
          </button>
        </div>

        {showCertForm && editingCert && (
          <form onSubmit={handleSaveCert} className="space-y-4 p-4 rounded-lg border border-fg-dim/15 bg-bg">
            <Input label="Name" value={editingCert.name} onChange={updateCert("name")} required />
            <Input label="Issuer" value={editingCert.issuer} onChange={updateCert("issuer")} required />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 text-sm rounded bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/20 hover:bg-accent-secondary/25 transition-colors">
                {editingCert._id ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowCertForm(false); setEditingCert(null); }} className="px-4 py-2 text-sm rounded bg-fg-dim/10 text-fg-muted hover:bg-fg-dim/20 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        <DataTable
          columns={[
            { key: "name", label: "Certificate" },
            { key: "issuer", label: "Issuer" },
          ]}
          data={certItems}
          onEdit={(item) => { setEditingCert({ ...item }); setShowCertForm(true); }}
          onDelete={setDeletingCert}
        />
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
