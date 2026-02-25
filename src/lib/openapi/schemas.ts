import { z } from "zod";
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

// --- Helper: add MongoDB _id + timestamps to a Zod object schema ---

function withMongoId<T extends z.ZodObject>(schema: T) {
  return schema.extend({
    _id: z.string(),
    createdAt: z.string().meta({ description: "ISO 8601 timestamp" }).optional(),
    updatedAt: z.string().meta({ description: "ISO 8601 timestamp" }).optional(),
  });
}

// --- Resource response schemas (with _id) ---

export const blogPostResponse = withMongoId(blogPostSchema).meta({
  id: "BlogPost",
  description: "A blog post",
});

export const projectResponse = withMongoId(projectSchema).meta({
  id: "Project",
  description: "A portfolio project",
});

export const skillCategoryResponse = withMongoId(skillCategorySchema).meta({
  id: "SkillCategory",
  description: "A skill category with list of skills",
});

export const experienceResponse = withMongoId(experienceSchema).meta({
  id: "Experience",
  description: "A work experience entry",
});

export const educationResponse = withMongoId(educationSchema).meta({
  id: "Education",
  description: "An education entry",
});

export const certificateResponse = withMongoId(certificateSchema).meta({
  id: "Certificate",
  description: "A certificate entry",
});

export const contactResponse = withMongoId(contactSchema).meta({
  id: "Contact",
  description: "Contact information",
});

export const socialResponse = withMongoId(socialSchema).meta({
  id: "Social",
  description: "A social media link",
});

export const profileResponse = withMongoId(profileSchema).meta({
  id: "Profile",
  description: "User profile information",
});

export const newsArticleResponse = withMongoId(newsArticleSchema).meta({
  id: "NewsArticle",
  description: "A news article",
});

export const announcementResponse = withMongoId(announcementSchema).meta({
  id: "Announcement",
  description: "An announcement",
});

// --- Common response schemas ---

export const errorResponse = z
  .object({
    error: z.string(),
  })
  .meta({ id: "ErrorResponse", description: "Standard error response" });

export const successResponse = z
  .object({
    success: z.boolean(),
  })
  .meta({ id: "SuccessResponse", description: "Standard success response" });

export const likesResponse = z
  .object({
    count: z.number(),
    liked: z.boolean(),
  })
  .meta({ id: "LikesResponse", description: "Blog post likes info" });

export const authCheckResponse = z
  .object({
    authenticated: z.boolean(),
  })
  .meta({ id: "AuthCheckResponse", description: "Authentication status" });

export const uploadResponse = z
  .object({
    url: z.string(),
    filename: z.string(),
  })
  .meta({ id: "UploadResponse", description: "File upload result" });

// --- Parameter schemas ---

export const idParam = z.string().meta({
  description: "MongoDB ObjectId",
  example: "507f1f77bcf86cd799439011",
});

export const slugParam = z.string().meta({
  description: "URL-safe slug",
  example: "my-blog-post",
});
