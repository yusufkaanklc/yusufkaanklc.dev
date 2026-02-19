import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogReader extends Document {
  blogPostId: mongoose.Types.ObjectId;
  ip: string;
  readAt: Date;
}

const BlogReaderSchema = new Schema<IBlogReader>({
  blogPostId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
  ip: { type: String, required: true },
  readAt: { type: Date, default: Date.now },
});

BlogReaderSchema.index({ blogPostId: 1, ip: 1 }, { unique: true });

export const BlogReader =
  mongoose.models.BlogReader || mongoose.model<IBlogReader>("BlogReader", BlogReaderSchema);
