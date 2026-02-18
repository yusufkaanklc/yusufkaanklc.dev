"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";

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
  const router = useRouter();

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
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-accent">Dashboard</h2>
        <span className="text-fg-dim/40 text-xs font-mono">~/</span>
      </div>

      {!stats ? (
        <CardSkeleton count={7} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((card) => (
            <button
              key={card.label}
              onClick={() => router.push(card.href)}
              className="admin-card text-left p-5 group cursor-pointer"
            >
              <p className="text-2xl font-bold text-accent group-hover:glow transition-all">{card.count}</p>
              <p className="text-xs text-fg-dim mt-1.5 font-mono">{card.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
