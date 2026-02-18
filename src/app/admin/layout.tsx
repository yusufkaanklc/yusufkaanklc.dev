"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Education", href: "/admin/education" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Socials", href: "/admin/socials" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="flex h-[100dvh] bg-bg-secondary text-fg overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-bg border-r border-fg-dim/15 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-fg-dim/15">
          <h1 className="text-accent font-bold text-lg">Admin Panel</h1>
          <p className="text-fg-dim text-xs mt-1">yusufkaanklc.dev</p>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-fg-muted hover:bg-fg-dim/10 hover:text-fg"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-fg-dim/15">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded text-sm text-t-red hover:bg-t-red/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-4 py-3 border-b border-fg-dim/15 bg-bg shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-fg-muted hover:text-fg p-1"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <button
            onClick={() => router.push("/")}
            className="text-xs text-fg-dim hover:text-accent transition-colors"
          >
            View Site
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
