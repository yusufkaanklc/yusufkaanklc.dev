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

  // Refs to always hold latest values
  const itemsRef = useRef(items);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);
  const lastScrollYRef = useRef(0);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  // Restore from cache on mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (!raw) return;

      const cached: CacheEntry<T> = JSON.parse(raw);
      if (cached.items.length > 0) {
        setItems(cached.items);
        setPage(cached.page);
        setHasMore(cached.hasMore);

        const targetScrollY = cached.scrollY;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, targetScrollY);

            setTimeout(() => {
              if (Math.abs(window.scrollY - targetScrollY) > 10) {
                window.scrollTo(0, targetScrollY);
              }
            }, 100);
          });
        });
      }
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }, [cacheKey]);

  // Clear cache on actual page reload/close (beforeunload)
  // Client-side SPA navigations do NOT trigger beforeunload
  useEffect(() => {
    const onBeforeUnload = () => {
      sessionStorage.removeItem(cacheKey);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [cacheKey]);

  // Save to cache on scroll (debounced) and unmount
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const save = (reason: string) => {
      const scrollY = reason === "unmount" ? lastScrollYRef.current : window.scrollY;
      const entry: CacheEntry<T> = {
        items: itemsRef.current,
        page: pageRef.current,
        hasMore: hasMoreRef.current,
        scrollY,
      };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch {
        // sessionStorage full or unavailable
      }
    };

    const onScroll = () => {
      // Don't track scrollY=0 — Next.js resets scroll to top before unmount,
      // which would overwrite the real position
      if (window.scrollY > 0) {
        lastScrollYRef.current = window.scrollY;
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => save("scroll"), 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
      save("unmount");
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
