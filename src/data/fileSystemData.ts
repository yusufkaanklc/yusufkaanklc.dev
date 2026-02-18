import { type DirectoryNode } from "@/types/fileSystem";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillCategories } from "./skills";
import { experiences } from "./experience";
import { educationList, certificates } from "./education";
import { socials } from "./socials";
import { blogPosts } from "./blog";
import { contact } from "./contact";

export function buildFileSystem(): DirectoryNode {
  return {
    type: "directory",
    name: "~",
    children: {
      "about.txt": {
        type: "file",
        name: "about.txt",
        content: [
          `Name: ${profile.name}`,
          `Title: ${profile.title}`,
          `Location: ${profile.location}`,
          `Email: ${profile.email}`,
          "",
          profile.bio,
        ].join("\n"),
      },
      "contact.txt": {
        type: "file",
        name: "contact.txt",
        content: [
          `Email: ${contact.email}`,
          `Phone: ${contact.phone}`,
          `Location: ${contact.location}`,
          `Status: ${contact.availability}`,
        ].join("\n"),
      },
      "socials.txt": {
        type: "file",
        name: "socials.txt",
        content: socials.map((s) => `${s.name}: ${s.url}`).join("\n"),
      },
      projects: {
        type: "directory",
        name: "projects",
        children: Object.fromEntries(
          projects.map((p, i) => [
            `project${i + 1}.md`,
            {
              type: "file" as const,
              name: `project${i + 1}.md`,
              content: [
                `# ${p.name}`,
                "",
                p.description,
                "",
                `Tech: ${p.tech.join(", ")}`,
                p.github ? `GitHub: ${p.github}` : "",
                p.url ? `URL: ${p.url}` : "",
              ]
                .filter(Boolean)
                .join("\n"),
            },
          ])
        ),
      },
      skills: {
        type: "directory",
        name: "skills",
        children: Object.fromEntries(
          skillCategories.map((cat) => [
            `${cat.name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}.txt`,
            {
              type: "file" as const,
              name: `${cat.name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}.txt`,
              content: cat.skills.join("\n"),
            },
          ])
        ),
      },
      experience: {
        type: "directory",
        name: "experience",
        children: {
          "timeline.txt": {
            type: "file",
            name: "timeline.txt",
            content: experiences
              .map((e) => `${e.period} | ${e.role} @ ${e.company} (${e.location})\n  ${e.description}`)
              .join("\n\n"),
          },
        },
      },
      education: {
        type: "directory",
        name: "education",
        children: {
          "degrees.txt": {
            type: "file",
            name: "degrees.txt",
            content: educationList
              .map((e) => `${e.period} | ${e.degree} @ ${e.school}${e.description ? `\n  ${e.description}` : ""}`)
              .join("\n\n"),
          },
          "certificates.txt": {
            type: "file",
            name: "certificates.txt",
            content: certificates
              .map((c) => `* ${c.name} (${c.issuer})`)
              .join("\n"),
          },
        },
      },
      blog: {
        type: "directory",
        name: "blog",
        children: {
          "posts.txt": {
            type: "file",
            name: "posts.txt",
            content: blogPosts
              .map((p) => `[${p.date}] ${p.title}\n  ${p.summary}`)
              .join("\n\n"),
          },
        },
      },
    },
  };
}
