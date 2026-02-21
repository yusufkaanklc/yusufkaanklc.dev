export interface BlogPostData {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
}

export interface AnnouncementData {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  priority: "normal" | "important" | "critical";
}
