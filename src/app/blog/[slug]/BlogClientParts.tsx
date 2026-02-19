"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

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
