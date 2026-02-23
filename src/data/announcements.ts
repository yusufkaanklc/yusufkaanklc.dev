import type { Announcement } from "@/types/models";

export const announcements: Announcement[] = [
  {
    title: "Welcome to My Terminal Portfolio",
    slug: "welcome-to-terminal-portfolio",
    date: "2025-01-20",
    summary: "The terminal portfolio is now live! Explore my work using familiar CLI commands.",
    content: "## Welcome!\n\nI'm excited to announce that my terminal-style portfolio is now live. You can navigate through my projects, blog posts, and more using familiar command-line interface commands.\n\nType `help` in the terminal to see available commands.",
    priority: "normal",
    published: true,
  },
];
