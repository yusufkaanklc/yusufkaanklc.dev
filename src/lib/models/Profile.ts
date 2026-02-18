import mongoose, { Schema, type Document } from "mongoose";

export interface IProfile extends Document {
  name: string;
  username: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  resumeUrl: string;
}

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
