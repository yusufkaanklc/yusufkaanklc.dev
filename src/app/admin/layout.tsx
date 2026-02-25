"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "~" },
  { label: "Profile", href: "/admin/profile", icon: "$" },
  { label: "Projects", href: "/admin/projects", icon: ">" },
  { label: "Blog", href: "/admin/blog", icon: "#" },
  { label: "Announcements", href: "/admin/announcements", icon: "+" },
  { label: "News", href: "/admin/news", icon: "!" },
  { label: "Skills", href: "/admin/skills", icon: "*" },
  { label: "Experience", href: "/admin/experience", icon: "@" },
  { label: "Education", href: "/admin/education", icon: "^" },
  { label: "Contact", href: "/admin/contact", icon: "&" },
  { label: "Socials", href: "/admin/socials", icon: "%" },
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-bg border-r border-fg-dim/10 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-fg-dim/10">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-sm glow">admin</span>
            <span className="text-fg-dim text-xs">@</span>
            <span className="text-accent-secondary text-sm">panel</span>
          </div>
          <p className="text-fg-dim text-[10px] mt-1.5 font-mono tracking-wider uppercase">yusufkaanklc.dev</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2.5 group ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/15"
                    : "text-fg-muted hover:bg-fg-dim/5 hover:text-fg border border-transparent"
                }`}
              >
                <span className={`font-mono text-xs w-4 ${isActive ? "text-accent" : "text-fg-dim group-hover:text-accent/50"}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-fg-dim/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-t-red/80 hover:bg-t-red/8 hover:text-t-red transition-all flex items-center gap-2.5 border border-transparent"
          >
            <span className="font-mono text-xs w-4">!</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-3 border-b border-fg-dim/10 bg-bg/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-fg-dim hover:text-fg p-1 transition-colors"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-fg-dim font-mono">
            <span className="text-t-green">admin</span>
            <span>:</span>
            <span className="text-prompt-path">{pathname.replace("/admin", "~")}</span>
            <span className="text-fg-dim animate-blink">_</span>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => router.push("/")}
            className="text-xs text-fg-dim hover:text-accent transition-colors font-mono px-2.5 py-1 rounded border border-fg-dim/10 hover:border-accent/20"
          >
            cd ~/
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 admin-fade-in">{children}</main>
      </div>
    </div>
  );
}
