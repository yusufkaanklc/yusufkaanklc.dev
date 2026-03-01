import type { Metadata } from "next";
import { getAnnouncementsPaginated } from "@/lib/fetchers";
import { generateCollectionSchema, generateBreadcrumbs } from "@/lib/schema";
import { ContentPageLayout } from "@/components/ui/ContentPageLayout";
import { AnnouncementList } from "@/components/lists/AnnouncementList";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Announcements | Yusuf Kaan Kilic",
  description:
    "Announcements and updates from Yusuf Kaan Kilic.",
  openGraph: {
    title: "Announcements | Yusuf Kaan Kilic",
    description: "Announcements and updates from Yusuf Kaan Kilic.",
    url: "https://yusufkaanklc.dev/announcements",
    siteName: "yusufkaanklc.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Announcements | Yusuf Kaan Kilic",
    description: "Announcements and updates from Yusuf Kaan Kilic.",
  },
  alternates: {
    canonical: "https://yusufkaanklc.dev/announcements",
  },
};

export default async function AnnouncementsListPage() {
  const { items, page, hasMore } = await getAnnouncementsPaginated(1);

  const schemas = [
    generateCollectionSchema("Announcements", "/announcements", "Announcements and updates from Yusuf Kaan Kilic."),
    generateBreadcrumbs([{ name: "Announcements", path: "/announcements" }]),
  ];

  return (
    <ContentPageLayout backHref="/" backLabel="Back to terminal" schemas={schemas}>
      <h1 className="text-2xl font-bold text-accent mb-2">
        Announcements
      </h1>
      <p className="text-fg-muted text-sm mb-8">
        Latest announcements and updates.
      </p>

      <AnnouncementList initialItems={items} initialPage={page} initialHasMore={hasMore} />
    </ContentPageLayout>
  );
}
