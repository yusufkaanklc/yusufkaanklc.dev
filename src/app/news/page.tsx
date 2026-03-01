import type { Metadata } from "next";
import { getNewsPaginated } from "@/lib/fetchers";
import { generateCollectionSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { NewsList } from "@/components/lists/NewsList";

export const revalidate = 60;

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
  const { items, page, hasMore } = await getNewsPaginated(1);

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

      <NewsList initialItems={items} initialPage={page} initialHasMore={hasMore} />
    </ContentPageLayout>
  );
}
