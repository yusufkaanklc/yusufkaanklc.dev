import mongoose, { Schema, type Document } from "mongoose";
import type { Announcement as AnnouncementBase } from "@/types/models";

export interface IAnnouncement extends AnnouncementBase, Document {}

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
