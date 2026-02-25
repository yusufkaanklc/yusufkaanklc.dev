import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPost } from "@/lib/fetchers";
import { generateArticleSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { TagList } from "@/components/ui/TagBadge";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { LikeButton } from "@/components/ui/LikeButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const baseUrl = "https://yusufkaanklc.dev";

  return {
    title: `${post.title} | Yusuf Kaan Kilic`,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: "Yusuf Kaan Kilic" }],
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: "yusufkaanklc.dev",
      type: "article",
      locale: "en_US",
      publishedTime: post.date,
      tags: post.tags,
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const schemas = [
    generateArticleSchema({
      type: "BlogPosting",
      title: post.title,
      summary: post.summary,
      date: post.date,
      path: `/blog/${post.slug}`,
      image: post.coverImage,
      keywords: post.tags.join(", "),
    }),
    generateBreadcrumbs([
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <ContentPageLayout backHref="/blog" backLabel="Back to blog" schemas={schemas}>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg border border-fg-dim/20 mb-6"
        />
      )}

      <h1 className="text-2xl font-bold text-accent mb-3">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-4">
        <span>{post.date}</span>
        <span className="text-fg-dim/40">|</span>
        <span>{post.readingTime} min read</span>
      </div>

      <div className="mb-4">
        <TagList tags={post.tags} />
      </div>

      <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3 mb-8">
        {post.summary}
      </p>

      {post.content && (
        <article className="prose prose-invert max-w-none blog-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      )}

      <div className="flex items-center justify-between border-t border-fg-dim/20 pt-6 mt-8">
        <LikeButton slug={post.slug} />
        <ShareButtons slug={post.slug} title={post.title} />
      </div>
    </ContentPageLayout>
  );
}
