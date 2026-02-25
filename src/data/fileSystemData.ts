import { type DirectoryNode } from "@/types/fileSystem";
import { type SiteData } from "@/types/commands";
import { profile as staticProfile } from "./profile";
import { projects as staticProjects } from "./projects";
import { skillCategories as staticSkillCategories } from "./skills";
import { experiences as staticExperiences } from "./experience";
import { educationList as staticEducationList, certificates as staticCertificates } from "./education";
import { socials as staticSocials } from "./socials";
import { blogPosts as staticBlogPosts } from "./blog";
import { announcements as staticAnnouncements } from "./announcements";
import { news as staticNews } from "./news";
import { contact as staticContact } from "./contact";

export function buildFileSystem(data?: SiteData): DirectoryNode {
  const profile = data?.profile ?? staticProfile;
  const projects = data?.projects ?? staticProjects;
  const skillCategories = data?.skillCategories ?? staticSkillCategories;
  const experiences = data?.experiences ?? staticExperiences;
  const educationList = data?.educationList ?? staticEducationList;
  const certificates = data?.certificates ?? staticCertificates;
  const socials = data?.socials ?? staticSocials;
  const blogPosts = data?.blogPosts ?? staticBlogPosts;
  const announcements = data?.announcements ?? staticAnnouncements;
  const newsArticles = data?.newsArticles ?? staticNews;
  const contact = data?.contact ?? staticContact;

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
        children: Object.fromEntries(
          blogPosts
            .filter((p) => p.published)
            .map((p) => [
              `${p.slug}.md`,
              {
                type: "file" as const,
                name: `${p.slug}.md`,
                content: [
                  `# ${p.title}`,
                  "",
                  `Date: ${p.date}`,
                  `Reading Time: ${p.readingTime} min`,
                  p.tags.length > 0 ? `Tags: ${p.tags.join(", ")}` : "",
                  "",
                  p.summary,
                  "",
                  "---",
                  "",
                  p.content ?? "",
                ]
                  .filter((line, i) => i < 6 || line !== "")
                  .join("\n"),
              },
            ])
        ),
      },
      announcements: {
        type: "directory",
        name: "announcements",
        children: Object.fromEntries(
          announcements
            .filter((a) => a.published)
            .map((a) => [
              `${a.slug}.md`,
              {
                type: "file" as const,
                name: `${a.slug}.md`,
                content: [
                  `# ${a.title}`,
                  "",
                  `Date: ${a.date}`,
                  `Priority: ${a.priority}`,
                  "",
                  a.summary,
                  "",
                  "---",
                  "",
                  a.content ?? "",
                ]
                  .filter((line, i) => i < 5 || line !== "")
                  .join("\n"),
              },
            ])
        ),
      },
      news: {
        type: "directory",
        name: "news",
        children: Object.fromEntries(
          newsArticles
            .filter((n) => n.published)
            .map((n) => [
              `${n.slug}.md`,
              {
                type: "file" as const,
                name: `${n.slug}.md`,
                content: [
                  `# ${n.title}`,
                  "",
                  `Date: ${n.date}`,
                  n.tags.length > 0 ? `Tags: ${n.tags.join(", ")}` : "",
                  "",
                  n.summary,
                  "",
                  "---",
                  "",
                  n.content ?? "",
                ]
                  .filter((line, i) => i < 4 || line !== "")
                  .join("\n"),
              },
            ])
        ),
      },
    },
  };
}
