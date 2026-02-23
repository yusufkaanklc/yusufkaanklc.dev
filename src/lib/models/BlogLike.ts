import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogLike extends Document {
  blogPostId: mongoose.Types.ObjectId;
  token: string;
  ip?: string;
  likedAt: Date;
}

const BlogLikeSchema = new Schema<IBlogLike>({
  blogPostId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
  token: { type: String, required: true },
  ip: { type: String },
  likedAt: { type: Date, default: Date.now },
});

BlogLikeSchema.index({ blogPostId: 1, token: 1 }, { unique: true });
BlogLikeSchema.index({ blogPostId: 1 });

export const BlogLike =
  mongoose.models.BlogLike || mongoose.model<IBlogLike>("BlogLike", BlogLikeSchema);
