export interface BlogPost {
  title: string;
  date: string;
  summary: string;
  url?: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "Building a Terminal Portfolio with Next.js",
    date: "2025-01-15",
    summary: "How I built an interactive terminal-style portfolio website using Next.js and TypeScript.",
    url: "#",
  },
  {
    title: "Modern CSS Techniques for Web Developers",
    date: "2024-12-01",
    summary: "Exploring the latest CSS features that make building beautiful UIs easier.",
    url: "#",
  },
];
