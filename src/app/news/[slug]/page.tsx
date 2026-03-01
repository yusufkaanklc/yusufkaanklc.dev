import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { getNewsArticle } from "@/lib/fetchers";
import { generateArticleSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { TagList } from "@/components/ui/TagBadge";
import { ShareButtons } from "@/components/ui/ShareButtons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    return { title: "News Not Found" };
  }

  const baseUrl = "https://yusufkaanklc.dev";
  const ogImage = article.coverImage
    ? article.coverImage.startsWith("/")
      ? `${baseUrl}${article.coverImage}`
      : article.coverImage
    : undefined;

  return {
    title: `${article.title} | Yusuf Kaan Kilic`,
    description: article.summary,
    authors: [{ name: "Yusuf Kaan Kilic" }],
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `${baseUrl}/news/${article.slug}`,
      siteName: "yusufkaanklc.dev",
      type: "article",
      locale: "en_US",
      publishedTime: article.date,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: {
      canonical: `${baseUrl}/news/${article.slug}`,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const schemas = [
    generateArticleSchema({
      type: "NewsArticle",
      title: article.title,
      summary: article.summary,
      date: article.date,
      path: `/news/${article.slug}`,
      image: article.coverImage,
    }),
    generateBreadcrumbs([
      { name: "News", path: "/news" },
      { name: article.title, path: `/news/${article.slug}` },
    ]),
  ];

  return (
    <ContentPageLayout backHref="/news" backLabel="Back to news" schemas={schemas}>
      {article.coverImage && (
        <Image
          src={article.coverImage}
          alt={article.title}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
          className="w-full aspect-video object-cover rounded-lg border border-fg-dim/20 mb-6"
          unoptimized
        />
      )}

      <h1 className="text-2xl font-bold text-accent mb-3">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-4">
        <span>{article.date}</span>
      </div>

      {article.tags.length > 0 && (
        <div className="mb-4">
          <TagList tags={article.tags} />
        </div>
      )}

      <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3 mb-8">
        {article.summary}
      </p>

      {article.content && (
        <article className="prose prose-invert max-w-none blog-content">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      )}

      {article.url && (
        <div className="mt-6">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline text-sm"
          >
            Read original source &rarr;
          </a>
        </div>
      )}

      <div className="flex items-center justify-end border-t border-fg-dim/20 pt-6 mt-8">
        <ShareButtons slug={article.slug} title={article.title} basePath="news" />
      </div>
    </ContentPageLayout>
  );
}
