import mongoose, { Schema, type Document } from "mongoose";
import type { Education as EducationBase } from "@/types/models";

export interface IEducation extends EducationBase, Document {}

const EducationSchema = new Schema<IEducation>(
  {
    degree: { type: String, required: true },
    school: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Education =
  mongoose.models.Education || mongoose.model<IEducation>("Education", EducationSchema);
