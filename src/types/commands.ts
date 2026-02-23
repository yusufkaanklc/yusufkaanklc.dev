import { type ReactNode } from "react";
import type {
  WithOptionalId,
  BlogPost,
  Announcement,
  Project,
  Experience,
  Education,
  Certificate,
  SkillCategory,
  Social,
  Contact,
  Profile,
} from "./models";

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
  profile: Profile;
  projects: WithOptionalId<Project>[];
  blogPosts: WithOptionalId<BlogPost>[];
  skillCategories: WithOptionalId<SkillCategory>[];
  experiences: WithOptionalId<Experience>[];
  educationList: WithOptionalId<Education>[];
  certificates: WithOptionalId<Certificate>[];
  contact: Contact;
  socials: WithOptionalId<Social>[];
  announcements: WithOptionalId<Announcement>[];
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
