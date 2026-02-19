import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe (lowercase letters, numbers, hyphens)"),
  date: z.string().min(1).max(50).trim(),
  summary: z.string().min(1).max(1000).trim(),
  content: z.string().max(50000).trim().optional(),
  tags: z.array(z.string().min(1).max(50).trim()).max(10).default([]),
  coverImage: z.string().url().max(500).optional().or(z.literal("")),
  readingTime: z.number().min(1).optional(),
  published: z.boolean().default(false),
  url: z.string().url().max(500).optional().or(z.literal("")),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  description: z.string().min(1).max(2000).trim(),
  tech: z.array(z.string().min(1).max(50).trim()).max(20).default([]),
  url: z.string().url().max(500).optional().or(z.literal("")),
  github: z.string().url().max(500).optional().or(z.literal("")),
});

export const skillCategorySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  skills: z.array(z.string().min(1).max(100).trim()).max(50).default([]),
});

export const experienceSchema = z.object({
  role: z.string().min(1).max(200).trim(),
  company: z.string().min(1).max(200).trim(),
  location: z.string().min(1).max(200).trim(),
  period: z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(5000).trim(),
});

export const educationSchema = z.object({
  degree: z.string().min(1).max(200).trim(),
  school: z.string().min(1).max(200).trim(),
  period: z.string().min(1).max(100).trim(),
  description: z.string().max(2000).trim().optional(),
});

export const certificateSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  issuer: z.string().min(1).max(200).trim(),
});

export const contactSchema = z.object({
  email: z.string().email().max(255).trim(),
  phone: z.string().min(1).max(50).trim(),
  location: z.string().min(1).max(200).trim(),
  availability: z.string().min(1).max(200).trim(),
});

export const socialSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  url: z.string().url().max(500),
  icon: z.string().max(100).trim().default(""),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  username: z.string().min(1).max(100).trim(),
  title: z.string().min(1).max(200).trim(),
  bio: z.string().min(1).max(5000).trim(),
  location: z.string().min(1).max(200).trim(),
  email: z.string().email().max(255).trim(),
  phone: z.string().min(1).max(50).trim(),
  website: z.string().url().max(500),
  resumeUrl: z.string().max(500).trim().default(""),
});
