import { z } from "zod";
import type { ZodOpenApiPathsObject } from "zod-openapi";
import {
  blogPostResponse,
  projectResponse,
  skillCategoryResponse,
  experienceResponse,
  educationResponse,
  certificateResponse,
  contactResponse,
  socialResponse,
  profileResponse,
  newsArticleResponse,
  announcementResponse,
  errorResponse,
  likesResponse,
  slugParam,
} from "../schemas";

export const publicPaths: ZodOpenApiPathsObject = {
  "/api/data": {
    get: {
      tags: ["Public"],
      summary: "Get all public portfolio data",
      description:
        "Returns aggregated public data: profile, projects, blog posts, skills, experience, education, certificates, contact, socials, announcements, and news articles. Blog posts, announcements, and news articles are filtered to published only.",
      responses: {
        "200": {
          description: "All public portfolio data",
          content: {
            "application/json": {
              schema: z.object({
                profile: profileResponse.nullable(),
                projects: z.array(projectResponse),
                blogPosts: z.array(blogPostResponse),
                skillCategories: z.array(skillCategoryResponse),
                experiences: z.array(experienceResponse),
                educationList: z.array(educationResponse),
                certificates: z.array(certificateResponse),
                contact: contactResponse.nullable(),
                socials: z.array(socialResponse),
                announcements: z.array(announcementResponse),
                newsArticles: z.array(newsArticleResponse),
              }),
            },
          },
        },
      },
    },
  },

  "/api/announcements/latest": {
    get: {
      tags: ["Public"],
      summary: "Get the latest announcement",
      description:
        "Returns the most recently published announcement with limited fields.",
      responses: {
        "200": {
          description: "Latest announcement or null",
          content: {
            "application/json": {
              schema: z
                .object({
                  _id: z.string(),
                  title: z.string(),
                  slug: z.string(),
                  summary: z.string(),
                  priority: z.enum(["normal", "important", "critical"]),
                  date: z.string(),
                })
                .nullable(),
            },
          },
        },
      },
    },
  },

  "/api/news/latest": {
    get: {
      tags: ["Public"],
      summary: "Get the latest news article",
      description:
        "Returns the most recently published news article with limited fields.",
      responses: {
        "200": {
          description: "Latest news article or null",
          content: {
            "application/json": {
              schema: z
                .object({
                  _id: z.string(),
                  title: z.string(),
                  slug: z.string(),
                  summary: z.string(),
                  tags: z.array(z.string()),
                  date: z.string(),
                })
                .nullable(),
            },
          },
        },
      },
    },
  },

  "/api/blog/{slug}": {
    get: {
      tags: ["Public"],
      summary: "Get a published blog post by slug",
      requestParams: { path: z.object({ slug: slugParam }) },
      responses: {
        "200": {
          description: "Blog post found",
          content: {
            "application/json": { schema: blogPostResponse },
          },
        },
        "404": {
          description: "Blog post not found",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  },

  "/api/blog/{slug}/likes": {
    get: {
      tags: ["Public"],
      summary: "Get like count for a blog post",
      requestParams: { path: z.object({ slug: slugParam }) },
      responses: {
        "200": {
          description: "Like count and current user like status",
          content: {
            "application/json": { schema: likesResponse },
          },
        },
        "404": {
          description: "Blog post not found",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
    post: {
      tags: ["Public"],
      summary: "Toggle like on a blog post",
      description:
        "Toggles the like status for the current visitor (identified by cookie).",
      requestParams: { path: z.object({ slug: slugParam }) },
      responses: {
        "200": {
          description: "Updated like count and status",
          content: {
            "application/json": { schema: likesResponse },
          },
        },
        "404": {
          description: "Blog post not found",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  },
};
