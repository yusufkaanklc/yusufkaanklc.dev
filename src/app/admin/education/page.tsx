"use client";

import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input, TextArea } from "@/components/admin/FormField";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { useAdminCRUD } from "@/hooks/useAdminCRUD";
import type { EduItem, CertItem } from "@/types/admin";

const emptyEdu: EduItem = { _id: "", degree: "", school: "", period: "", description: "" };
const emptyCert: CertItem = { _id: "", name: "", issuer: "" };

export default function EducationPage() {
  const edu = useAdminCRUD<EduItem>({ resource: "education", empty: emptyEdu });
  const cert = useAdminCRUD<CertItem>({ resource: "certificates", empty: emptyCert });

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
            onClick={edu.startNew}
            className="px-3 py-2 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium"
          >
            + New
          </button>
        </div>

        {edu.showForm && edu.editing && (
          <form onSubmit={edu.handleSave} className="admin-section space-y-5 admin-fade-in">
            <Input label="Degree" value={edu.editing.degree} onChange={edu.update("degree")} required />
            <Input label="School" value={edu.editing.school} onChange={edu.update("school")} required />
            <Input label="Period" value={edu.editing.period} onChange={edu.update("period")} placeholder="e.g. 2020 - 2024" required />
            <TextArea label="Description" value={edu.editing.description ?? ""} onChange={edu.update("description")} />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-5 py-2.5 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-medium">
                {edu.editing._id ? "Update" : "Create"}
              </button>
              <button type="button" onClick={edu.cancelEdit} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
                Cancel
              </button>
            </div>
          </form>
        )}

        {edu.loading ? <LoadingSkeleton rows={3} /> : (
          <DataTable
            columns={[
              { key: "degree", label: "Degree" },
              { key: "school", label: "School" },
              { key: "period", label: "Period", render: (e) => <span className="text-fg-dim font-mono text-xs">{e.period}</span> },
            ]}
            data={edu.items}
            onEdit={edu.startEdit}
            onDelete={edu.setDeleting}
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
            onClick={cert.startNew}
            className="px-3 py-2 text-sm rounded-lg bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 hover:bg-accent-secondary/20 transition-all font-medium"
          >
            + New
          </button>
        </div>

        {cert.showForm && cert.editing && (
          <form onSubmit={cert.handleSave} className="admin-section space-y-5 admin-fade-in">
            <Input label="Name" value={cert.editing.name} onChange={cert.update("name")} required />
            <Input label="Issuer" value={cert.editing.issuer} onChange={cert.update("issuer")} required />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-5 py-2.5 text-sm rounded-lg bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 hover:bg-accent-secondary/20 transition-all font-medium">
                {cert.editing._id ? "Update" : "Create"}
              </button>
              <button type="button" onClick={cert.cancelEdit} className="px-4 py-2.5 text-sm rounded-lg bg-fg-dim/8 text-fg-muted hover:bg-fg-dim/15 transition-colors border border-fg-dim/10">
                Cancel
              </button>
            </div>
          </form>
        )}

        {cert.loading ? <LoadingSkeleton rows={3} /> : (
          <DataTable
            columns={[
              { key: "name", label: "Certificate" },
              { key: "issuer", label: "Issuer" },
            ]}
            data={cert.items}
            onEdit={cert.startEdit}
            onDelete={cert.setDeleting}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!edu.deleting}
        title="Delete Education"
        message={`Are you sure you want to delete "${edu.deleting?.degree}"?`}
        onConfirm={edu.handleDelete}
        onCancel={() => edu.setDeleting(null)}
      />

      <ConfirmDialog
        open={!!cert.deleting}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${cert.deleting?.name}"?`}
        onConfirm={cert.handleDelete}
        onCancel={() => cert.setDeleting(null)}
      />
    </div>
  );
}
