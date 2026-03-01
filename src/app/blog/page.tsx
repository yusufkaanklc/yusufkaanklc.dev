import type { Metadata } from "next";
import { getPostsPaginated } from "@/lib/fetchers";
import { generateCollectionSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { BlogList } from "@/components/lists/BlogList";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Yusuf Kaan Kilic",
  description:
    "Blog posts about software engineering, web development, and technology by Yusuf Kaan Kilic.",
  openGraph: {
    title: "Blog | Yusuf Kaan Kilic",
    description:
      "Blog posts about software engineering, web development, and technology.",
    url: "https://yusufkaanklc.dev/blog",
    siteName: "yusufkaanklc.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Yusuf Kaan Kilic",
    description:
      "Blog posts about software engineering, web development, and technology.",
  },
  alternates: {
    canonical: "https://yusufkaanklc.dev/blog",
  },
};

export default async function BlogListPage() {
  const { items, page, hasMore } = await getPostsPaginated(1);

  const schemas = [
    generateCollectionSchema("Blog", "/blog", "Blog posts about software engineering, web development, and technology by Yusuf Kaan Kilic."),
    generateBreadcrumbs([{ name: "Blog", path: "/blog" }]),
  ];

  return (
    <ContentPageLayout backHref="/" backLabel="Back to terminal" schemas={schemas}>
      <h1 className="text-2xl font-bold text-accent mb-2">Blog</h1>
      <p className="text-fg-muted text-sm mb-8">
        Posts about software engineering, web development, and technology.
      </p>

      <BlogList initialItems={items} initialPage={page} initialHasMore={hasMore} />
    </ContentPageLayout>
  );
}
