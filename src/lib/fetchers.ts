import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { Announcement } from "@/lib/models/Announcement";
import type { BlogPostData } from "@/types/blog";
import type { AnnouncementData } from "@/types/blog";

export async function getPost(slug: string): Promise<BlogPostData | null> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return {
      title: post.title,
      slug: post.slug,
      date: post.date,
      summary: post.summary,
      content: post.content,
      tags: post.tags,
      coverImage: post.coverImage,
      readingTime: post.readingTime,
    };
  } catch {
    return null;
  }
}

export async function getAnnouncement(slug: string): Promise<AnnouncementData | null> {
  try {
    await connectDB();
    const item = await Announcement.findOne({ slug, published: true }).lean();
    if (!item) return null;
    return {
      title: item.title,
      slug: item.slug,
      date: item.date,
      summary: item.summary,
      content: item.content,
      priority: item.priority,
    };
  } catch {
    return null;
  }
}
