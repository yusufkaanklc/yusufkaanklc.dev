import mongoose, { Schema, type Document } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  school: string;
  period: string;
  description?: string;
}

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
