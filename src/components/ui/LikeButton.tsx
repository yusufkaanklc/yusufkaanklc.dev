"use client";

import { useEffect, useState, useCallback } from "react";

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
