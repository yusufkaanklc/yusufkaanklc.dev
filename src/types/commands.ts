import { type ReactNode } from "react";

export interface CommandDefinition {
  name: string;
  description: string;
  usage?: string;
  hidden?: boolean;
  handler: (args: string[], context: CommandContext) => CommandResult | Promise<CommandResult>;
}

export interface CommandContext {
  currentPath: string;
  history: string[];
  setCurrentPath: (path: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  requestInput: (prompt: string, masked: boolean) => Promise<string>;
  data?: SiteData;
}

export interface SiteData {
  profile: {
    name: string;
    username: string;
    title: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    resumeUrl: string;
  };
  projects: { _id?: string; name: string; description: string; tech: string[]; url?: string; github?: string }[];
  blogPosts: { _id?: string; title: string; slug: string; date: string; summary: string; content?: string; tags: string[]; coverImage?: string; readingTime: number; published: boolean; url?: string }[];
  skillCategories: { _id?: string; name: string; skills: string[] }[];
  experiences: { _id?: string; role: string; company: string; location: string; period: string; description: string }[];
  educationList: { _id?: string; degree: string; school: string; period: string; description?: string }[];
  certificates: { _id?: string; name: string; issuer: string }[];
  contact: { email: string; phone: string; location: string; availability: string };
  socials: { _id?: string; name: string; url: string; icon: string }[];
  announcements: { _id?: string; title: string; slug: string; date: string; summary: string; content?: string; priority: "normal" | "important" | "critical"; published: boolean }[];
}

export interface CommandResult {
  output: TerminalOutputLine[];
  clear?: boolean;
}

export interface TerminalOutputLine {
  id: string;
  type: "text" | "component" | "ascii" | "error" | "system";
  content?: string;
  component?: ReactNode;
  className?: string;
}
