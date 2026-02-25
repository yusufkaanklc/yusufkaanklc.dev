import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      ...(article.coverImage ? { images: [{ url: article.coverImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
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
      <h1 className="text-2xl font-bold text-accent mb-3">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-4">
        <span>{article.date}</span>
      </div>

      <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3 mb-8">
        {article.summary}
      </p>

      {article.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden border border-fg-dim/20">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {article.content && (
        <article className="prose prose-invert max-w-none blog-content">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      )}

      {article.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-fg-dim/20">
          <TagList tags={article.tags} />
        </div>
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
