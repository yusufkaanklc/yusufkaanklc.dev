import type { Metadata } from "next";
import Link from "next/link";
import { getAllNews } from "@/lib/fetchers";
import { generateCollectionSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { TagList } from "@/components/ui/TagBadge";

export const metadata: Metadata = {
  title: "News | Yusuf Kaan Kilic",
  description:
    "Latest news and updates from Yusuf Kaan Kilic.",
  openGraph: {
    title: "News | Yusuf Kaan Kilic",
    description: "Latest news and updates from Yusuf Kaan Kilic.",
    url: "https://yusufkaanklc.dev/news",
    siteName: "yusufkaanklc.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "News | Yusuf Kaan Kilic",
    description: "Latest news and updates from Yusuf Kaan Kilic.",
  },
  alternates: {
    canonical: "https://yusufkaanklc.dev/news",
  },
};

export default async function NewsListPage() {
  const news = await getAllNews();

  const schemas = [
    generateCollectionSchema("News", "/news", "Latest news and updates from Yusuf Kaan Kilic."),
    generateBreadcrumbs([{ name: "News", path: "/news" }]),
  ];

  return (
    <ContentPageLayout backHref="/" backLabel="Back to terminal" schemas={schemas}>
      <h1 className="text-2xl font-bold text-accent mb-2">News</h1>
      <p className="text-fg-muted text-sm mb-8">
        Latest news and updates.
      </p>

      {news.length === 0 ? (
        <p className="text-fg-dim">No news yet.</p>
      ) : (
        <div className="space-y-6">
          {news.map((article) => (
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
        </div>
      )}
    </ContentPageLayout>
  );
}
