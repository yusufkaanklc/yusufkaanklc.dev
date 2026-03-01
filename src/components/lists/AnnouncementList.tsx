"use client";

import Link from "next/link";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { priorityColors } from "@/utils/priority";
import type { AnnouncementData } from "@/lib/fetchers";

interface AnnouncementListProps {
  initialItems: AnnouncementData[];
  initialPage: number;
  initialHasMore: boolean;
}

export function AnnouncementList({ initialItems, initialPage, initialHasMore }: AnnouncementListProps) {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<AnnouncementData>({
    cacheKey: "announcements-list",
    apiUrl: "/api/announcements",
    initialItems,
    initialPage,
    initialHasMore,
  });

  if (items.length === 0) {
    return <p className="text-fg-dim">No announcements yet.</p>;
  }

  return (
    <div className="space-y-6">
      {items.map((a) => {
        const colors = priorityColors[a.priority];
        return (
          <article
            key={a.slug}
            className="border border-fg-dim/20 rounded-lg p-4 hover:border-accent/40 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-2">
              <span>{a.date}</span>
              <span className="text-fg-dim/40">|</span>
              <span
                className={`px-2 py-0.5 rounded capitalize font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {a.priority}
              </span>
            </div>

            <Link
              href={`/announcements/${a.slug}`}
              className="text-accent hover:underline font-bold text-lg block mb-2"
            >
              {a.title}
            </Link>

            <p className="text-fg-muted text-sm">{a.summary}</p>
          </article>
        );
      })}

      <div ref={sentinelRef} className="h-1" />

      {isLoading && (
        <p className="text-fg-dim text-sm text-center py-4">Loading more...</p>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-fg-dim text-xs text-center py-4">No more announcements.</p>
      )}
    </div>
  );
}
