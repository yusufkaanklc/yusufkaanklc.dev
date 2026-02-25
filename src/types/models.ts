export type Priority = "normal" | "important" | "critical";
export type WithId<T> = T & { _id: string };
export type WithOptionalId<T> = T & { _id?: string };

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  published: boolean;
  url?: string;
}

export interface Announcement {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  priority: Priority;
  published: boolean;
}

export interface NewsArticle {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  url?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  description?: string;
}

export interface Certificate {
  name: string;
  issuer: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface Contact {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

export interface Profile {
  name: string;
  username: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  resumeUrl: string;
}
