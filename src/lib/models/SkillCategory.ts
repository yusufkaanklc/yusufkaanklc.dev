import mongoose, { Schema, type Document } from "mongoose";

export interface ISkillCategory extends Document {
  name: string;
  skills: string[];
}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    name: { type: String, required: true },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

export const SkillCategory =
  mongoose.models.SkillCategory || mongoose.model<ISkillCategory>("SkillCategory", SkillCategorySchema);
