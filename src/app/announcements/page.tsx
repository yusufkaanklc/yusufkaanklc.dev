import type { Metadata } from "next";
import Link from "next/link";
import { getAllAnnouncements } from "@/lib/fetchers";
import { priorityColors } from "@/utils/priority";
import { ThemeApplier } from "@/app/blog/[slug]/BlogClientParts";

export const metadata: Metadata = {
  title: "Announcements | Yusuf Kaan Kilic",
  description:
    "Announcements and updates from Yusuf Kaan Kilic.",
  openGraph: {
    title: "Announcements | Yusuf Kaan Kilic",
    description: "Announcements and updates from Yusuf Kaan Kilic.",
    url: "https://yusufkaanklc.dev/announcements",
    siteName: "yusufkaanklc.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Announcements | Yusuf Kaan Kilic",
    description: "Announcements and updates from Yusuf Kaan Kilic.",
  },
  alternates: {
    canonical: "https://yusufkaanklc.dev/announcements",
  },
};

export default async function AnnouncementsListPage() {
  const announcements = await getAllAnnouncements();

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Announcements",
    description: "Announcements and updates from Yusuf Kaan Kilic.",
    url: "https://yusufkaanklc.dev/announcements",
    author: {
      "@type": "Person",
      name: "Yusuf Kaan Kilic",
      url: "https://yusufkaanklc.dev",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yusufkaanklc.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Announcements",
        item: "https://yusufkaanklc.dev/announcements",
      },
    ],
  };

  return (
    <>
      <ThemeApplier />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="min-h-screen bg-bg-secondary text-fg font-mono">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/"
              className="text-accent hover:underline text-sm mb-6 inline-block"
            >
              &larr; Back to terminal
            </Link>

            <h1 className="text-2xl font-bold text-accent mb-2">
              Announcements
            </h1>
            <p className="text-fg-muted text-sm">
              Latest announcements and updates.
            </p>
          </div>

          {announcements.length === 0 ? (
            <p className="text-fg-dim">No announcements yet.</p>
          ) : (
            <div className="space-y-6">
              {announcements.map((a) => {
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
