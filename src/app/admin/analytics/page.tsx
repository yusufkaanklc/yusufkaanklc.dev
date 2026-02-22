"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LoadingSkeleton } from "@/components/admin/LoadingSkeleton";
import { countryFlag, formatDate } from "@/utils/formatters";
import type { Visitor, Reader, AnalyticsData } from "@/types/admin";


export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"visitors" | "readers">("visitors");
  const [selectedBlog, setSelectedBlog] = useState<string>("");
  const [confirm, setConfirm] = useState<{ title: string; message: string; action: () => Promise<void> } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d: AnalyticsData) => {
        setData(d);
        if (!selectedBlog && d.blogReaders.length > 0) {
          setSelectedBlog(d.blogReaders[0].blogPostId);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedBlog]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteVisitor = async (visitor: Visitor) => {
    await fetch(`/api/admin/analytics/visitors/${visitor._id}`, { method: "DELETE" });
    load();
  };

  const deleteAllVisitors = async () => {
    await fetch("/api/admin/analytics/visitors", { method: "DELETE" });
    load();
  };

  const deleteReader = async (reader: Reader) => {
    await fetch(`/api/admin/analytics/readers/${reader._id}`, { method: "DELETE" });
    load();
  };

  const deleteAllReaders = async () => {
    await fetch("/api/admin/analytics/readers", { method: "DELETE" });
    load();
  };

  const deleteBlogReaders = async (blogPostId: string) => {
    await fetch(`/api/admin/analytics/readers?blogPostId=${blogPostId}`, { method: "DELETE" });
    load();
  };

  const selectedBlogData = data?.blogReaders.find((b) => b.blogPostId === selectedBlog);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-accent">Analytics</h2>
        <span className="text-fg-dim/40 text-xs font-mono">~/analytics</span>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="admin-card p-4">
            <p className="text-2xl font-bold text-accent">{data.visitorCount}</p>
            <p className="text-xs text-fg-dim mt-1 font-mono">Total Visitors</p>
          </div>
          <div className="admin-card p-4">
            <p className="text-2xl font-bold text-accent">{data.totalReaderCount}</p>
            <p className="text-xs text-fg-dim mt-1 font-mono">Total Readers</p>
          </div>
          <div className="admin-card p-4">
            <p className="text-2xl font-bold text-accent">{data.blogReaders.length}</p>
            <p className="text-xs text-fg-dim mt-1 font-mono">Blog Posts</p>
          </div>
          <div className="admin-card p-4">
            <p className="text-2xl font-bold text-accent">
              {new Set(data.visitors.map((v) => v.countryCode).filter(Boolean)).size}
            </p>
            <p className="text-xs text-fg-dim mt-1 font-mono">Countries</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-fg-dim/10">
        {(["visitors", "readers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${
              activeTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-fg-dim hover:text-fg"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <LoadingSkeleton rows={8} />
      ) : activeTab === "visitors" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() =>
                setConfirm({
                  title: "Delete All Visitors",
                  message: `Delete all ${data?.visitorCount ?? 0} visitor records? This cannot be undone.`,
                  action: deleteAllVisitors,
                })
              }
              className="px-3 py-2 text-xs rounded-lg bg-t-red/10 text-t-red border border-t-red/20 hover:bg-t-red/20 transition-all font-medium"
            >
              Delete All Visitors
            </button>
          </div>
          <DataTable
            columns={[
              { key: "ip", label: "IP Address", render: (v: Visitor) => <span className="font-mono text-xs">{v.ip || "-"}</span> },
              {
                key: "country",
                label: "Country",
                render: (v: Visitor) =>
                  v.country ? (
                    <span className="text-xs">
                      {countryFlag(v.countryCode)} {v.country}
                    </span>
                  ) : (
                    <span className="text-fg-dim text-xs">-</span>
                  ),
              },
              {
                key: "city",
                label: "Location",
                render: (v: Visitor) =>
                  v.city ? (
                    <span className="text-xs text-fg-dim">
                      {v.city}{v.regionName ? `, ${v.regionName}` : ""}
                    </span>
                  ) : (
                    <span className="text-fg-dim text-xs">-</span>
                  ),
              },
              {
                key: "isp",
                label: "ISP",
                render: (v: Visitor) => <span className="text-xs text-fg-dim">{v.isp || "-"}</span>,
              },
              {
                key: "visitedAt",
                label: "Last Visit",
                render: (v: Visitor) => <span className="text-xs text-fg-dim font-mono">{formatDate(v.visitedAt)}</span>,
              },
            ]}
            data={data?.visitors ?? []}
            onDelete={(v) => deleteVisitor(v)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div ref={dropdownRef} className="relative min-w-0 flex-1 basis-48">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg bg-bg border border-fg-dim/15 text-fg hover:border-accent/50 focus:border-accent/50 focus:outline-none transition-colors"
              >
                <span className="truncate">
                  {selectedBlogData ? `${selectedBlogData.title} (${selectedBlogData.readerCount} readers)` : "Select blog..."}
                </span>
                <svg className={`w-4 h-4 shrink-0 text-fg-dim transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg bg-bg border border-fg-dim/15 shadow-lg py-1">
                  {data?.blogReaders.map((b) => (
                    <li
                      key={b.blogPostId}
                      onClick={() => {
                        setSelectedBlog(b.blogPostId);
                        setDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-sm cursor-pointer truncate transition-colors ${
                        b.blogPostId === selectedBlog
                          ? "bg-accent/10 text-accent"
                          : "text-fg hover:bg-fg-dim/10"
                      }`}
                    >
                      {b.title} ({b.readerCount} readers)
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedBlogData && selectedBlogData.readerCount > 0 && (
              <button
                onClick={() =>
                  setConfirm({
                    title: "Delete Blog Readers",
                    message: `Delete all ${selectedBlogData.readerCount} readers for "${selectedBlogData.title}"?`,
                    action: () => deleteBlogReaders(selectedBlog),
                  })
                }
                className="px-3 py-2 text-xs rounded-lg bg-t-red/10 text-t-red border border-t-red/20 hover:bg-t-red/20 transition-all font-medium whitespace-nowrap"
              >
                Delete Blog Readers
              </button>
            )}
            <button
              onClick={() =>
                setConfirm({
                  title: "Delete All Readers",
                  message: `Delete all ${data?.totalReaderCount ?? 0} reader records across all blogs? This cannot be undone.`,
                  action: deleteAllReaders,
                })
              }
              className="px-3 py-2 text-xs rounded-lg bg-t-red/10 text-t-red border border-t-red/20 hover:bg-t-red/20 transition-all font-medium whitespace-nowrap"
            >
              Delete All Readers
            </button>
          </div>
          <DataTable
            columns={[
              { key: "ip", label: "IP Address", render: (r: Reader) => <span className="font-mono text-xs">{r.ip || "-"}</span> },
              {
                key: "country",
                label: "Country",
                render: (r: Reader) =>
                  r.country ? (
                    <span className="text-xs">
                      {countryFlag(r.countryCode)} {r.country}
                    </span>
                  ) : (
                    <span className="text-fg-dim text-xs">-</span>
                  ),
              },
              {
                key: "city",
                label: "Location",
                render: (r: Reader) =>
                  r.city ? (
                    <span className="text-xs text-fg-dim">
                      {r.city}{r.regionName ? `, ${r.regionName}` : ""}
                    </span>
                  ) : (
                    <span className="text-fg-dim text-xs">-</span>
                  ),
              },
              {
                key: "isp",
                label: "ISP",
                render: (r: Reader) => <span className="text-xs text-fg-dim">{r.isp || "-"}</span>,
              },
              {
                key: "readAt",
                label: "Read At",
                render: (r: Reader) => <span className="text-xs text-fg-dim font-mono">{formatDate(r.readAt)}</span>,
              },
            ]}
            data={selectedBlogData?.readers ?? []}
            onDelete={(r) => deleteReader(r)}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        onConfirm={async () => {
          if (confirm) await confirm.action();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
