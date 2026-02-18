import mongoose, { Schema, type Document } from "mongoose";

export interface IExperience extends Document {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

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
