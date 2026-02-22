import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogReader extends Document {
  blogPostId: mongoose.Types.ObjectId;
  token: string;
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  regionName?: string;
  isp?: string;
  readAt: Date;
}

const BlogReaderSchema = new Schema<IBlogReader>({
  blogPostId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
  token: { type: String, required: true },
  ip: { type: String },
  country: { type: String },
  countryCode: { type: String },
  city: { type: String },
  regionName: { type: String },
  isp: { type: String },
  readAt: { type: Date, default: Date.now },
});

BlogReaderSchema.index({ blogPostId: 1, token: 1 }, { unique: true });

export const BlogReader =
  mongoose.models.BlogReader || mongoose.model<IBlogReader>("BlogReader", BlogReaderSchema);
