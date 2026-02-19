import mongoose, { Schema, type Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  slug: string;
  date: string;
  summary: string;
  content?: string;
  priority: "normal" | "important" | "critical";
  published: boolean;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String },
    priority: { type: String, enum: ["normal", "important", "critical"], default: "normal" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Announcement = mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
