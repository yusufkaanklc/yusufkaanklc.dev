export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    name: "Portfolio Terminal",
    description: "Interactive terminal-style portfolio website built with Next.js",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    url: "https://yusufkaanklc.dev",
    github: "https://github.com/yusufkaanklc/yusufkaanklc.dev",
  },
  {
    name: "Project Two",
    description: "A full-stack web application with modern architecture",
    tech: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/yusufkaanklc/project-two",
  },
  {
    name: "Project Three",
    description: "Open source developer tool for improving workflow",
    tech: ["TypeScript", "CLI", "Node.js"],
    github: "https://github.com/yusufkaanklc/project-three",
  },
];
