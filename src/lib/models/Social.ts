import mongoose, { Schema, type Document } from "mongoose";

export interface ISocial extends Document {
  name: string;
  url: string;
  icon: string;
}

const SocialSchema = new Schema<ISocial>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Social = mongoose.models.Social || mongoose.model<ISocial>("Social", SocialSchema);
