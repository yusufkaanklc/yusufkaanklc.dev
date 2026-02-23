import mongoose, { Schema, type Document } from "mongoose";
import type { Experience as ExperienceBase } from "@/types/models";

export interface IExperience extends ExperienceBase, Document {}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Experience =
  mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);
