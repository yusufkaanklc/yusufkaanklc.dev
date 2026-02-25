import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/lib/models/BlogPost";
import { Announcement } from "@/lib/models/Announcement";
import { NewsArticle } from "@/lib/models/News";
import type { BlogPost as BlogPostType, Announcement as AnnouncementType, NewsArticle as NewsArticleType } from "@/types/models";
import type { Model } from "mongoose";

type BlogPostData = Omit<BlogPostType, "published">;
type AnnouncementData = Omit<AnnouncementType, "published">;
type NewsArticleData = Omit<NewsArticleType, "published">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createListFetcher<T>(model: Model<any>, mapper: (doc: any) => T) {
  return async (): Promise<T[]> => {
    try {
      await connectDB();
      const items = await model.find({ published: true }).sort({ createdAt: -1 }).lean();
      return items.map(mapper);
    } catch {
      return [];
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDetailFetcher<T>(model: Model<any>, mapper: (doc: any) => T) {
  return async (slug: string): Promise<T | null> => {
    try {
      await connectDB();
      const item = await model.findOne({ slug, published: true }).lean();
      if (!item) return null;
      return mapper(item);
    } catch {
      return null;
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBlogPost = (post: any): BlogPostData => ({
  title: post.title,
  slug: post.slug,
  date: post.date,
  summary: post.summary,
  content: post.content,
  tags: post.tags,
  coverImage: post.coverImage,
  readingTime: post.readingTime,
  url: post.url,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBlogPostList = (post: any): BlogPostData => ({
  title: post.title,
  slug: post.slug,
  date: post.date,
  summary: post.summary,
  tags: post.tags,
  coverImage: post.coverImage,
  readingTime: post.readingTime,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapAnnouncement = (item: any): AnnouncementData => ({
  title: item.title,
  slug: item.slug,
  date: item.date,
  summary: item.summary,
  content: item.content,
  priority: item.priority,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapAnnouncementList = (item: any): AnnouncementData => ({
  title: item.title,
  slug: item.slug,
  date: item.date,
  summary: item.summary,
  priority: item.priority,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapNewsArticle = (item: any): NewsArticleData => ({
  title: item.title,
  slug: item.slug,
  date: item.date,
  summary: item.summary,
  content: item.content,
  tags: item.tags,
  coverImage: item.coverImage,
  url: item.url,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapNewsArticleList = (item: any): NewsArticleData => ({
  title: item.title,
  slug: item.slug,
  date: item.date,
  summary: item.summary,
  tags: item.tags,
  coverImage: item.coverImage,
  url: item.url,
});

export const getAllPosts = createListFetcher<BlogPostData>(BlogPost, mapBlogPostList);
export const getPost = createDetailFetcher<BlogPostData>(BlogPost, mapBlogPost);

export const getAllAnnouncements = createListFetcher<AnnouncementData>(Announcement, mapAnnouncementList);
export const getAnnouncement = createDetailFetcher<AnnouncementData>(Announcement, mapAnnouncement);

export const getAllNews = createListFetcher<NewsArticleData>(NewsArticle, mapNewsArticleList);
export const getNewsArticle = createDetailFetcher<NewsArticleData>(NewsArticle, mapNewsArticle);
