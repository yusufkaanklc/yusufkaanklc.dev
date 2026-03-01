"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CacheEntry<T> {
  items: T[];
  page: number;
  hasMore: boolean;
  scrollY: number;
}

interface UseInfiniteScrollOptions<T> {
  cacheKey: string;
  apiUrl: string;
  initialItems: T[];
  initialPage: number;
  initialHasMore: boolean;
}

export function useInfiniteScroll<T>({
  cacheKey,
  apiUrl,
  initialItems,
  initialPage,
  initialHasMore,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const restoredRef = useRef(false);

  // Refs to always hold latest values (avoids stale closures in scroll listener)
  const itemsRef = useRef(items);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // Restore from cache on mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    try {
      // On full page reload, clear cache so we start fresh
      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && navEntries[0].type === "reload") {
        sessionStorage.removeItem(cacheKey);
        return;
      }

      const raw = sessionStorage.getItem(cacheKey);
      if (!raw) return;

      const cached: CacheEntry<T> = JSON.parse(raw);
      if (cached.items.length > 0) {
        setItems(cached.items);
        setPage(cached.page);
        setHasMore(cached.hasMore);

        // Double rAF for scroll restore after DOM paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, cached.scrollY);
          });
        });
      }
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }, [cacheKey]);

  // Save to cache on scroll (debounced) and unmount
  // Uses refs so this effect only mounts/unmounts once — no stale closure issues
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const save = () => {
      const entry: CacheEntry<T> = {
        items: itemsRef.current,
        page: pageRef.current,
        hasMore: hasMoreRef.current,
        scrollY: window.scrollY,
      };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch {
        // sessionStorage full or unavailable
      }
    };

    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(save, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
      save();
    };
  }, [cacheKey]);

  // Fetch next page
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const nextPage = page + 1;
      const res = await fetch(`${apiUrl}?page=${nextPage}`);
      const data = await res.json();

      setItems((prev) => [...prev, ...data.items]);
      setPage(data.page);
      setHasMore(data.hasMore);
    } catch {
      // silently fail, user can scroll again
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [apiUrl, page, hasMore]);

  // IntersectionObserver on sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return { items, isLoading, hasMore, sentinelRef };
}
