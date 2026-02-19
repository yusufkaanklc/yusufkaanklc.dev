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

export const blogPosts: BlogPost[] = [
  {
    title: "Building a Terminal Portfolio with Next.js",
    slug: "building-terminal-portfolio-nextjs",
    date: "2025-01-15",
    summary: "How I built an interactive terminal-style portfolio website using Next.js and TypeScript.",
    tags: ["nextjs", "typescript", "portfolio"],
    readingTime: 5,
    published: true,
  },
  {
    title: "Modern CSS Techniques for Web Developers",
    slug: "modern-css-techniques",
    date: "2024-12-01",
    summary: "Exploring the latest CSS features that make building beautiful UIs easier.",
    tags: ["css", "web-development", "frontend"],
    readingTime: 4,
    published: true,
  },
];
