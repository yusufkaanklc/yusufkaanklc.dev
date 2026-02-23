import mongoose, { Schema, type Document } from "mongoose";
import type { Social as SocialBase } from "@/types/models";

export interface ISocial extends SocialBase, Document {}

const SocialSchema = new Schema<ISocial>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Social = mongoose.models.Social || mongoose.model<ISocial>("Social", SocialSchema);
