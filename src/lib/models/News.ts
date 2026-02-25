import mongoose, { Schema, type Document } from "mongoose";
import type { NewsArticle as NewsArticleBase } from "@/types/models";

export interface INewsArticle extends NewsArticleBase, Document {}

const NewsArticleSchema = new Schema<INewsArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String },
    tags: { type: [String], default: [] },
    coverImage: { type: String },
    published: { type: Boolean, default: false },
    url: { type: String },
  },
  { timestamps: true }
);

export const NewsArticle = mongoose.models.NewsArticle || mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);
