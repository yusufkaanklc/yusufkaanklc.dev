import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/fetchers";
import { ThemeApplier } from "@/app/blog/[slug]/BlogClientParts";

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

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog",
    description:
      "Blog posts about software engineering, web development, and technology by Yusuf Kaan Kilic.",
    url: "https://yusufkaanklc.dev/blog",
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
        name: "Blog",
        item: "https://yusufkaanklc.dev/blog",
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

            <h1 className="text-2xl font-bold text-accent mb-2">Blog</h1>
            <p className="text-fg-muted text-sm">
              Posts about software engineering, web development, and technology.
            </p>
          </div>

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

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
