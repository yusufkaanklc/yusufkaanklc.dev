import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeApplier } from "./ThemeApplier";

interface ContentPageLayoutProps {
  backHref: string;
  backLabel: string;
  schemas?: Record<string, unknown>[];
  children: ReactNode;
}

export function ContentPageLayout({ backHref, backLabel, schemas, children }: ContentPageLayoutProps) {
  return (
    <>
      <ThemeApplier />
      {schemas?.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="min-h-screen bg-bg-secondary text-fg font-mono">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link
            href={backHref}
            className="text-accent hover:underline text-sm mb-6 inline-block"
          >
            &larr; {backLabel}
          </Link>
          {children}
        </div>
      </div>
    </>
  );
}
