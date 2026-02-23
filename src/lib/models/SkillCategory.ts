import mongoose, { Schema, type Document } from "mongoose";
import type { SkillCategory as SkillCategoryBase } from "@/types/models";

export interface ISkillCategory extends SkillCategoryBase, Document {}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    name: { type: String, required: true },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

export const SkillCategory =
  mongoose.models.SkillCategory || mongoose.model<ISkillCategory>("SkillCategory", SkillCategorySchema);
