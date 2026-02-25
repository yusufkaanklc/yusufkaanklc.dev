import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAnnouncement } from "@/lib/fetchers";
import { generateArticleSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { priorityTextColors } from "@/utils/priority";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);

  if (!announcement) {
    return { title: "Announcement Not Found" };
  }

  const baseUrl = "https://yusufkaanklc.dev";

  return {
    title: `${announcement.title} | Yusuf Kaan Kilic`,
    description: announcement.summary,
    authors: [{ name: "Yusuf Kaan Kilic" }],
    openGraph: {
      title: announcement.title,
      description: announcement.summary,
      url: `${baseUrl}/announcements/${announcement.slug}`,
      siteName: "yusufkaanklc.dev",
      type: "article",
      locale: "en_US",
      publishedTime: announcement.date,
    },
    twitter: {
      card: "summary_large_image",
      title: announcement.title,
      description: announcement.summary,
    },
    alternates: {
      canonical: `${baseUrl}/announcements/${announcement.slug}`,
    },
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);

  if (!announcement) {
    notFound();
  }

  const schemas = [
    generateArticleSchema({
      type: "BlogPosting",
      title: announcement.title,
      summary: announcement.summary,
      date: announcement.date,
      path: `/announcements/${announcement.slug}`,
    }),
    generateBreadcrumbs([
      { name: "Announcements", path: "/announcements" },
      { name: announcement.title, path: `/announcements/${announcement.slug}` },
    ]),
  ];

  return (
    <ContentPageLayout backHref="/announcements" backLabel="Back to announcements" schemas={schemas}>
      <h1 className="text-2xl font-bold text-accent mb-3">
        {announcement.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs text-fg-dim mb-4">
        <span>{announcement.date}</span>
        <span className="text-fg-dim/40">|</span>
        <span className={`font-medium capitalize ${priorityTextColors[announcement.priority]}`}>
          {announcement.priority}
        </span>
      </div>

      <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3 mb-8">
        {announcement.summary}
      </p>

      {announcement.content && (
        <article className="prose prose-invert max-w-none blog-content">
          <ReactMarkdown>{announcement.content}</ReactMarkdown>
        </article>
      )}
    </ContentPageLayout>
  );
}
