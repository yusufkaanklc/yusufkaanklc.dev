import mongoose, { Schema, type Document } from "mongoose";
import type { Profile as ProfileBase } from "@/types/models";

export interface IProfile extends ProfileBase, Document {}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: true },
    resumeUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
