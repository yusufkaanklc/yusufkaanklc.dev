import mongoose, { Schema, type Document } from "mongoose";
import type { Project as ProjectBase } from "@/types/models";

export interface IProject extends ProjectBase, Document {}

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
