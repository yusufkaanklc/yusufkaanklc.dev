"use client";

import { useEffect, useState } from "react";

interface Stats {
  projects: number;
  blogPosts: number;
  skills: number;
  experiences: number;
  education: number;
  certificates: number;
  socials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          projects: data.projects?.length ?? 0,
          blogPosts: data.blogPosts?.length ?? 0,
          skills: data.skillCategories?.length ?? 0,
          experiences: data.experiences?.length ?? 0,
          education: data.educationList?.length ?? 0,
          certificates: data.certificates?.length ?? 0,
          socials: data.socials?.length ?? 0,
        });
      });
  }, []);

  const cards = stats
    ? [
        { label: "Projects", count: stats.projects, href: "/admin/projects" },
        { label: "Blog Posts", count: stats.blogPosts, href: "/admin/blog" },
        { label: "Skill Categories", count: stats.skills, href: "/admin/skills" },
        { label: "Experiences", count: stats.experiences, href: "/admin/experience" },
        { label: "Education", count: stats.education, href: "/admin/education" },
        { label: "Certificates", count: stats.certificates, href: "/admin/education" },
        { label: "Social Links", count: stats.socials, href: "/admin/socials" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-accent">Dashboard</h2>

      {!stats ? (
        <p className="text-fg-dim animate-pulse">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="block p-4 rounded-lg border border-fg-dim/15 bg-bg hover:border-accent/30 transition-colors"
            >
              <p className="text-2xl font-bold text-accent">{card.count}</p>
              <p className="text-sm text-fg-muted mt-1">{card.label}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
