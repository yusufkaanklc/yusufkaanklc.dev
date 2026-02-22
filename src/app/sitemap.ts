import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { Announcement } from "@/lib/models/Announcement";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yusufkaanklc.dev";

  const fallback = new Date("2025-01-01");

  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true })
      .select("slug updatedAt")
      .lean();

    const announcementItems = await Announcement.find({ published: true })
      .select("slug updatedAt")
      .lean();

    const latestPost = posts.length > 0
      ? new Date(Math.max(...posts.map((p) => new Date(p.updatedAt ?? 0).getTime())))
      : fallback;

    const latestAnnouncement = announcementItems.length > 0
      ? new Date(Math.max(...announcementItems.map((a) => new Date(a.updatedAt ?? 0).getTime())))
      : fallback;

    const latestOverall = new Date(Math.max(latestPost.getTime(), latestAnnouncement.getTime()));

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: latestOverall,
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: latestPost,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/announcements`,
        lastModified: latestAnnouncement,
        changeFrequency: "weekly",
        priority: 0.6,
      },
    ];

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? fallback,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const announcementPages: MetadataRoute.Sitemap = announcementItems.map((a) => ({
      url: `${baseUrl}/announcements/${a.slug}`,
      lastModified: a.updatedAt ?? fallback,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticPages, ...blogPages, ...announcementPages];
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: fallback,
        changeFrequency: "monthly",
        priority: 1,
      },
    ];
  }
}
