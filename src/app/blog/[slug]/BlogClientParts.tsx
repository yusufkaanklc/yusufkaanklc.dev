"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { shareTwitter, shareLinkedIn, copyLink } from "@/utils/share";

export function ThemeApplier() {
  useTheme();
  return null;
}

export function ReaderCount({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`/api/blog/${slug}/readers`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => {});
  }, [slug]);

  return (
    <span>
      {count} reader{count !== 1 ? "s" : ""}
    </span>
  );
}

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}/likes`)
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count ?? 0);
        setLiked(data.liked ?? false);
      })
      .catch(() => {});
  }, [slug]);

  const handleClick = useCallback(() => {
    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    fetch(`/api/blog/${slug}/likes`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count ?? 0);
        setLiked(data.liked ?? false);
      })
      .catch(() => {
        // Revert on error
        setLiked((prev) => !prev);
        setCount((prev) => (liked ? prev + 1 : prev - 1));
      });
  }, [slug, liked]);

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-sm transition-colors cursor-pointer"
      aria-label={liked ? "Unlike post" : "Like post"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${liked ? "text-t-red" : "text-fg-dim"} ${animating ? "scale-125" : "scale-100"}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className={liked ? "text-t-red" : "text-fg-dim"}>{count}</span>
    </button>
  );
}

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://yusufkaanklc.dev/blog/${slug}`;

  const btnClass =
    "flex items-center gap-1 px-2 py-1 text-xs rounded border border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-colors text-fg-dim hover:text-fg cursor-pointer";

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-fg-dim">share:</span>
      <button onClick={() => shareTwitter(url, title)} className={btnClass} aria-label="Share on X">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X</span>
      </button>
      <button onClick={() => shareLinkedIn(url)} className={btnClass} aria-label="Share on LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span>LinkedIn</span>
      </button>
      <button onClick={() => copyLink(url, setCopied)} className={btnClass} aria-label="Copy link">
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-t-green">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
        <span className={copied ? "text-t-green" : ""}>{copied ? "copied!" : "link"}</span>
      </button>
    </div>
  );
}
