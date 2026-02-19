import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { Announcement } from "@/lib/models/Announcement";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yusufkaanklc.dev";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true })
      .select("slug updatedAt")
      .lean();

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const announcementItems = await Announcement.find({ published: true })
      .select("slug updatedAt")
      .lean();

    const announcementPages: MetadataRoute.Sitemap = announcementItems.map((a) => ({
      url: `${baseUrl}/announcements/${a.slug}`,
      lastModified: a.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticPages, ...blogPages, ...announcementPages];
  } catch {
    return staticPages;
  }
}
