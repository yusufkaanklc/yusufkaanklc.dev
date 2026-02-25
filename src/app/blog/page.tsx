import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/fetchers";
import { generateCollectionSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { TagList } from "@/components/ui/TagBadge";

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
  const posts = await getAllPosts();

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

      {posts.length === 0 ? (
        <p className="text-fg-dim">No published posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-fg-dim/20 rounded-lg p-4 hover:border-accent/40 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-2">
                <span>{post.date}</span>
                <span className="text-fg-dim/40">|</span>
                <span>{post.readingTime} min read</span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-accent hover:underline font-bold text-lg block mb-2"
              >
                {post.title}
              </Link>

              <p className="text-fg-muted text-sm mb-3">{post.summary}</p>

              <TagList tags={post.tags} />
            </article>
          ))}
        </div>
      )}
    </ContentPageLayout>
  );
}
