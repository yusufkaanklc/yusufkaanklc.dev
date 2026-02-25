import { createDocument } from "zod-openapi";
import type { ZodOpenApiObject } from "zod-openapi";
import { authPaths } from "./paths/auth";
import { adminPaths } from "./paths/admin";
import { publicPaths } from "./paths/public";

let cachedDoc: ReturnType<typeof createDocument> | null = null;

export function getOpenApiDocument() {
  if (cachedDoc) return cachedDoc;

  const spec: ZodOpenApiObject = {
    openapi: "3.1.0",
    info: {
      title: "yusufkaanklc.dev API",
      version: "1.0.0",
      description:
        "Portfolio & blog backend API. Public endpoints are open; admin endpoints require cookie-based authentication.",
      contact: {
        name: "Yusuf Kaan Kılıç",
        url: "https://yusufkaanklc.dev",
      },
    },
    servers: [
      { url: "https://yusufkaanklc.dev", description: "Production" },
      { url: "http://localhost:3000", description: "Development" },
    ],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Public", description: "Publicly accessible data endpoints" },
      { name: "Admin - Blog", description: "Blog post management" },
      { name: "Admin - Announcements", description: "Announcement management" },
      { name: "Admin - News", description: "News article management" },
      { name: "Admin - Projects", description: "Project management" },
      { name: "Admin - Skills", description: "Skill category management" },
      { name: "Admin - Experience", description: "Work experience management" },
      { name: "Admin - Education", description: "Education entry management" },
      { name: "Admin - Certificates", description: "Certificate management" },
      { name: "Admin - Socials", description: "Social link management" },
      { name: "Admin - Profile", description: "Profile management (singleton)" },
      { name: "Admin - Contact", description: "Contact info management (singleton)" },
      { name: "Admin - Upload", description: "File upload" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "admin-token",
          description: "JWT session token set on login (httpOnly, 2h expiry)",
        },
      },
    },
    paths: {
      ...authPaths,
      ...publicPaths,
      ...adminPaths,
    },
  };

  cachedDoc = createDocument(spec);
  return cachedDoc;
}
