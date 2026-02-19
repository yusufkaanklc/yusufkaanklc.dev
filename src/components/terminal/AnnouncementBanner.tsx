"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AnnouncementData {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  priority: "normal" | "important" | "critical";
  date: string;
}

const priorityStyles = {
  normal: { dot: "bg-accent", border: "border-accent/20", text: "text-accent", bg: "bg-accent/5" },
  important: { dot: "bg-t-yellow", border: "border-t-yellow/20", text: "text-t-yellow", bg: "bg-t-yellow/5" },
  critical: { dot: "bg-t-red", border: "border-t-red/20", text: "text-t-red", bg: "bg-t-red/5" },
};

export function AnnouncementBanner() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/announcements/latest")
      .then((r) => r.json())
      .then((data: AnnouncementData | null) => {
        if (!data) return;
        const lastSeen = localStorage.getItem("last-seen-announcement-id");
        if (lastSeen === data._id) return;
        setAnnouncement(data);
        requestAnimationFrame(() => setVisible(true));
      })
      .catch(() => {});
  }, []);

  const markSeen = () => {
    if (announcement) {
      localStorage.setItem("last-seen-announcement-id", announcement._id);
    }
  };

  const handleClick = () => {
    markSeen();
    router.push(`/announcements/${announcement!.slug}`);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    markSeen();
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
  };

  if (!announcement || dismissed) return null;

  const styles = priorityStyles[announcement.priority];

  return (
    <div
      onClick={handleClick}
      className={`border-b ${styles.border} ${styles.bg} cursor-pointer transition-all duration-300 ease-in-out overflow-hidden ${
        visible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-2.5">
        <span className={`w-2 h-2 rounded-full ${styles.dot} animate-pulse shrink-0 mt-1.5`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${styles.text} leading-tight`}>{announcement.title}</p>
          <p className="text-fg-dim text-xs mt-0.5 line-clamp-1">{announcement.summary}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-fg-dim hover:text-fg text-sm shrink-0 px-1 mt-0.5 transition-colors"
          aria-label="Dismiss announcement"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
