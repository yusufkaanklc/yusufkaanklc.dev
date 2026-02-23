import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { Announcement } from "@/lib/models/Announcement";
import type { BlogPost as BlogPostType, Announcement as AnnouncementType } from "@/types/models";

type BlogPostData = Omit<BlogPostType, "published">;
type AnnouncementData = Omit<AnnouncementType, "published">;

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

export async function getAllPosts(): Promise<BlogPostData[]> {
  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();
    return posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      coverImage: post.coverImage,
      readingTime: post.readingTime,
    }));
  } catch {
    return [];
  }
}

export async function getAllAnnouncements(): Promise<AnnouncementData[]> {
  try {
    await connectDB();
    const items = await Announcement.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();
    return items.map((item) => ({
      title: item.title,
      slug: item.slug,
      date: item.date,
      summary: item.summary,
      priority: item.priority,
    }));
  } catch {
    return [];
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
