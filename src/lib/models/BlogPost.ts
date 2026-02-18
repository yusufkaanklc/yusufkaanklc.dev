import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  date: string;
  summary: string;
  content?: string;
  url?: string;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
