"use client";

import Link from "next/link";
import { TagList } from "@/components/ui/TagBadge";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { BlogPostData } from "@/lib/fetchers";

interface BlogListProps {
  initialItems: BlogPostData[];
  initialPage: number;
  initialHasMore: boolean;
}

export function BlogList({ initialItems, initialPage, initialHasMore }: BlogListProps) {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<BlogPostData>({
    cacheKey: "blog-list",
    apiUrl: "/api/blog",
    initialItems,
    initialPage,
    initialHasMore,
  });

  if (items.length === 0) {
    return <p className="text-fg-dim">No published posts yet.</p>;
  }

  return (
    <div className="space-y-6">
      {items.map((post) => (
        <article
          key={post.slug}
          className="border border-fg-dim/20 rounded-lg p-4 hover:border-accent/40 transition-colors"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-2">
            <span>{post.date}</span>
            <span className="text-fg-dim/40">|</span>
            <span>{post.readingTime} min read</span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-accent hover:underline font-bold text-lg block mb-2"
          >
            {post.title}
          </Link>

          <p className="text-fg-muted text-sm mb-3">{post.summary}</p>

          <TagList tags={post.tags} />
        </article>
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isLoading && (
        <p className="text-fg-dim text-sm text-center py-4">Loading more...</p>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-fg-dim text-xs text-center py-4">No more posts.</p>
      )}
    </div>
  );
}
