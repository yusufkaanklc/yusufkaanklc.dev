export interface Stats {
  projects: number;
  blogPosts: number;
  skills: number;
  experiences: number;
  education: number;
  certificates: number;
  socials: number;
  announcements: number;
  visitors: number;
  totalReaders: number;
}

export interface Visitor {
  _id: string;
  ip: string;
  country?: string;
  countryCode?: string;
  city?: string;
  regionName?: string;
  isp?: string;
  visitedAt: string;
}

export interface Reader {
  _id: string;
  ip: string;
  country?: string;
  countryCode?: string;
  city?: string;
  regionName?: string;
  isp?: string;
  readAt: string;
}

export interface BlogReaderGroup {
  blogPostId: string;
  title: string;
  slug: string;
  readerCount: number;
  readers: Reader[];
}

export interface AnalyticsData {
  visitors: Visitor[];
  visitorCount: number;
  blogReaders: BlogReaderGroup[];
  totalReaderCount: number;
}

export interface AnnouncementItem {
  _id?: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  priority: "normal" | "important" | "critical";
  published: boolean;
}

export interface BlogItem {
  _id?: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime?: number;
  published: boolean;
  url?: string;
}

export interface ProjectItem {
  _id?: string;
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

export interface SkillItem {
  _id?: string;
  name: string;
  skills: string[];
}

export interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

export interface EduItem {
  _id?: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
}

export interface CertItem {
  _id?: string;
  name: string;
  issuer: string;
}

export interface ProfileData {
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

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  availability: string;
}

export interface SocialItem {
  _id?: string;
  name: string;
  url: string;
  icon: string;
}
