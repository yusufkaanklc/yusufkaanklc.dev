import mongoose, { Schema, type Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    tech: [{ type: String }],
    url: { type: String },
    github: { type: String },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
