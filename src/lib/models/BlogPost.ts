import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  published: boolean;
  url?: string;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String },
    tags: { type: [String], default: [] },
    coverImage: { type: String },
    readingTime: { type: Number, default: 1 },
    published: { type: Boolean, default: false },
    url: { type: String },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
