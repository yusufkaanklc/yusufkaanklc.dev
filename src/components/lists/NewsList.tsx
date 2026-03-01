"use client";

import Link from "next/link";
import { TagList } from "@/components/ui/TagBadge";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { NewsArticleData } from "@/lib/fetchers";

interface NewsListProps {
  initialItems: NewsArticleData[];
  initialPage: number;
  initialHasMore: boolean;
}

export function NewsList({ initialItems, initialPage, initialHasMore }: NewsListProps) {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<NewsArticleData>({
    cacheKey: "news-list",
    apiUrl: "/api/news",
    initialItems,
    initialPage,
    initialHasMore,
  });

  if (items.length === 0) {
    return <p className="text-fg-dim">No news yet.</p>;
  }

  return (
    <div className="space-y-6">
      {items.map((article) => (
        <article
          key={article.slug}
          className="border border-fg-dim/20 rounded-lg p-4 hover:border-accent/40 transition-colors"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-2">
            <span>{article.date}</span>
          </div>

          <Link
            href={`/news/${article.slug}`}
            className="text-accent hover:underline font-bold text-lg block mb-2"
          >
            {article.title}
          </Link>

          <p className="text-fg-muted text-sm mb-3">{article.summary}</p>

          <TagList tags={article.tags} />
        </article>
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isLoading && (
        <p className="text-fg-dim text-sm text-center py-4">Loading more...</p>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-fg-dim text-xs text-center py-4">No more news.</p>
      )}
    </div>
  );
}
