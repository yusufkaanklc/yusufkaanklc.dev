import { z } from "zod";
import type { ZodOpenApiPathsObject, ZodOpenApiPathItemObject } from "zod-openapi";
import {
  blogPostSchema,
  projectSchema,
  skillCategorySchema,
  experienceSchema,
  educationSchema,
  certificateSchema,
  contactSchema,
  socialSchema,
  profileSchema,
  newsArticleSchema,
  announcementSchema,
} from "@/lib/validations";
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
  successResponse,
  uploadResponse,
  idParam,
} from "../schemas";

// --- Helpers to generate DRY CRUD path definitions ---

const security = [{ cookieAuth: [] }];

function createCrudPaths(opts: {
  tag: string;
  basePath: string;
  resourceName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestSchema: z.ZodObject<any>;
  responseSchema: z.ZodType;
}): ZodOpenApiPathsObject {
  const { tag, basePath, resourceName, requestSchema, responseSchema } = opts;

  const listAndCreate: ZodOpenApiPathItemObject = {
    get: {
      tags: [tag],
      summary: `List all ${resourceName}s`,
      security,
      responses: {
        "200": {
          description: `Array of ${resourceName}s`,
          content: {
            "application/json": { schema: z.array(responseSchema) },
          },
        },
        "401": {
          description: "Unauthorized",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
    post: {
      tags: [tag],
      summary: `Create a ${resourceName}`,
      security,
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: requestSchema },
        },
      },
      responses: {
        "201": {
          description: `${resourceName} created`,
          content: {
            "application/json": { schema: responseSchema },
          },
        },
        "400": {
          description: "Validation error or duplicate",
          content: { "application/json": { schema: errorResponse } },
        },
        "401": {
          description: "Unauthorized",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  };

  const updateAndDelete: ZodOpenApiPathItemObject = {
    put: {
      tags: [tag],
      summary: `Update a ${resourceName}`,
      security,
      requestParams: { path: z.object({ id: idParam }) },
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: requestSchema.partial() },
        },
      },
      responses: {
        "200": {
          description: `${resourceName} updated`,
          content: {
            "application/json": { schema: responseSchema },
          },
        },
        "400": {
          description: "Invalid ID or validation error",
          content: { "application/json": { schema: errorResponse } },
        },
        "401": {
          description: "Unauthorized",
          content: { "application/json": { schema: errorResponse } },
        },
        "404": {
          description: `${resourceName} not found`,
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
    delete: {
      tags: [tag],
      summary: `Delete a ${resourceName}`,
      security,
      requestParams: { path: z.object({ id: idParam }) },
      responses: {
        "200": {
          description: `${resourceName} deleted`,
          content: {
            "application/json": { schema: successResponse },
          },
        },
        "400": {
          description: "Invalid ID",
          content: { "application/json": { schema: errorResponse } },
        },
        "401": {
          description: "Unauthorized",
          content: { "application/json": { schema: errorResponse } },
        },
        "404": {
          description: `${resourceName} not found`,
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  };

  return {
    [basePath]: listAndCreate,
    [`${basePath}/{id}`]: updateAndDelete,
  };
}

function createSingletonPaths(opts: {
  tag: string;
  basePath: string;
  resourceName: string;
  requestSchema: z.ZodType;
  responseSchema: z.ZodType;
}): ZodOpenApiPathsObject {
  const { tag, basePath, resourceName, requestSchema, responseSchema } = opts;

  return {
    [basePath]: {
      get: {
        tags: [tag],
        summary: `Get ${resourceName}`,
        security,
        responses: {
          "200": {
            description: `${resourceName} data`,
            content: {
              "application/json": { schema: responseSchema },
            },
          },
          "401": {
            description: "Unauthorized",
            content: { "application/json": { schema: errorResponse } },
          },
        },
      },
      put: {
        tags: [tag],
        summary: `Update ${resourceName}`,
        description: "Creates the document if it doesn't exist (upsert).",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: requestSchema },
          },
        },
        responses: {
          "200": {
            description: `${resourceName} updated`,
            content: {
              "application/json": { schema: responseSchema },
            },
          },
          "400": {
            description: "Validation error",
            content: { "application/json": { schema: errorResponse } },
          },
          "401": {
            description: "Unauthorized",
            content: { "application/json": { schema: errorResponse } },
          },
        },
      },
    },
  };
}

// --- Assemble all admin paths ---

export const adminPaths: ZodOpenApiPathsObject = {
  // Blog
  ...createCrudPaths({
    tag: "Admin - Blog",
    basePath: "/api/admin/blog",
    resourceName: "blog post",
    requestSchema: blogPostSchema,
    responseSchema: blogPostResponse,
  }),

  // Announcements
  ...createCrudPaths({
    tag: "Admin - Announcements",
    basePath: "/api/admin/announcements",
    resourceName: "announcement",
    requestSchema: announcementSchema,
    responseSchema: announcementResponse,
  }),

  // News
  ...createCrudPaths({
    tag: "Admin - News",
    basePath: "/api/admin/news",
    resourceName: "news article",
    requestSchema: newsArticleSchema,
    responseSchema: newsArticleResponse,
  }),

  // Projects
  ...createCrudPaths({
    tag: "Admin - Projects",
    basePath: "/api/admin/projects",
    resourceName: "project",
    requestSchema: projectSchema,
    responseSchema: projectResponse,
  }),

  // Skills
  ...createCrudPaths({
    tag: "Admin - Skills",
    basePath: "/api/admin/skills",
    resourceName: "skill category",
    requestSchema: skillCategorySchema,
    responseSchema: skillCategoryResponse,
  }),

  // Experience
  ...createCrudPaths({
    tag: "Admin - Experience",
    basePath: "/api/admin/experience",
    resourceName: "experience",
    requestSchema: experienceSchema,
    responseSchema: experienceResponse,
  }),

  // Education
  ...createCrudPaths({
    tag: "Admin - Education",
    basePath: "/api/admin/education",
    resourceName: "education entry",
    requestSchema: educationSchema,
    responseSchema: educationResponse,
  }),

  // Certificates
  ...createCrudPaths({
    tag: "Admin - Certificates",
    basePath: "/api/admin/certificates",
    resourceName: "certificate",
    requestSchema: certificateSchema,
    responseSchema: certificateResponse,
  }),

  // Socials
  ...createCrudPaths({
    tag: "Admin - Socials",
    basePath: "/api/admin/socials",
    resourceName: "social link",
    requestSchema: socialSchema,
    responseSchema: socialResponse,
  }),

  // Profile (singleton)
  ...createSingletonPaths({
    tag: "Admin - Profile",
    basePath: "/api/admin/profile",
    resourceName: "profile",
    requestSchema: profileSchema,
    responseSchema: profileResponse,
  }),

  // Contact (singleton)
  ...createSingletonPaths({
    tag: "Admin - Contact",
    basePath: "/api/admin/contact",
    resourceName: "contact info",
    requestSchema: contactSchema,
    responseSchema: contactResponse,
  }),

  // Upload
  "/api/admin/upload": {
    post: {
      tags: ["Admin - Upload"],
      summary: "Upload a resume PDF",
      description: "Accepts a PDF file (max 10 MB). Saves to `/public/uploads/`.",
      security,
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: z.object({
              file: z.string().meta({
                description: "PDF file to upload",
                contentMediaType: "application/pdf",
              }),
            }),
          },
        },
      },
      responses: {
        "200": {
          description: "File uploaded successfully",
          content: {
            "application/json": { schema: uploadResponse },
          },
        },
        "400": {
          description: "Invalid file (not PDF or too large)",
          content: { "application/json": { schema: errorResponse } },
        },
        "401": {
          description: "Unauthorized",
          content: { "application/json": { schema: errorResponse } },
        },
      },
    },
  },
};
