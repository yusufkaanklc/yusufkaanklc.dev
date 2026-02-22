import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getAnnouncement } from "@/lib/fetchers";
import { priorityTextColors } from "@/utils/priority";
import { ThemeApplier } from "@/app/blog/[slug]/BlogClientParts";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: announcement.title,
    description: announcement.summary,
    datePublished: announcement.date,
    author: {
      "@type": "Person",
      name: "Yusuf Kaan Kilic",
      url: "https://yusufkaanklc.dev",
    },
    url: `https://yusufkaanklc.dev/announcements/${announcement.slug}`,
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
      {
        "@type": "ListItem",
        position: 3,
        name: announcement.title,
        item: `https://yusufkaanklc.dev/announcements/${announcement.slug}`,
      },
    ],
  };

  return (
    <>
      <ThemeApplier />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="min-h-screen bg-bg-secondary text-fg font-mono">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/announcements"
              className="text-accent hover:underline text-sm mb-6 inline-block"
            >
              &larr; Back to announcements
            </Link>

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

            <p className="text-fg-muted text-sm border-l-2 border-accent/30 pl-3">
              {announcement.summary}
            </p>
          </div>

          {/* Content */}
          {announcement.content && (
            <article className="prose prose-invert max-w-none blog-content">
              <ReactMarkdown>{announcement.content}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
